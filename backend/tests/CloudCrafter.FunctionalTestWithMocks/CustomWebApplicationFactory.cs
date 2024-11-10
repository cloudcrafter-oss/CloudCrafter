using System.Data.Common;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Data.Interceptors;
using Hangfire;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Moq;
using Serilog;

namespace CloudCrafter.FunctionalTestWithMocks;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly Action<IServiceCollection>? _configureServices;
    private readonly DbConnection _postgreSqlConnection;
    private readonly string _redisConnectionString;

    public CustomWebApplicationFactory(
        DbConnection postgreSqlConnection,
        string redisConnectionString,
        Action<IServiceCollection>? configureServices = null
    )
    {
        _postgreSqlConnection = postgreSqlConnection;
        _redisConnectionString = redisConnectionString;
        _configureServices = configureServices;
    }

    /// <summary>
    ///     Overriding CreateHost to avoid creating a separate ServiceProvider per this thread:
    ///     https://github.com/dotnet-architecture/eShopOnWeb/issues/465
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.UseEnvironment("Development"); // will not send real emails
        var host = builder.Build();
        host.Start();

        return host;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Environment.SetEnvironmentVariable(
            "ConnectionStrings:RedisConnection",
            _redisConnectionString
        );

        builder.ConfigureServices(
            (context, services) =>
            {
                // Hangfire context
                //GlobalConfiguration.Configuration.UseInMemoryStorage();
                GlobalConfiguration.Configuration.UseSerilogLogProvider();
                var configuration = context.Configuration;

                services.AddSerilog(opt =>
                {
                    opt.ReadFrom.Configuration(configuration);
                });

                services.AddHangfireServer(options =>
                {
                    options.WorkerCount = 1; // Ensure jobs are processed immediately
                });
                // Configure test dependencies here
                services.RemoveDbContext<AppDbContext>();

                services.RemoveAll<IApplicationDbContext>();

                services.AddDbContext<AppDbContext>(
                    (sp, options) =>
                    {
                        options.UseNpgsql(_postgreSqlConnection);
                        options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                    }
                );

                services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
                services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

                services.AddScoped<IApplicationDbContext>(provider =>
                {
                    var ctx = provider.GetRequiredService<AppDbContext>();
                    return ctx;
                });
                services.AddScoped<ApplicationDbContextInitialiser>();

                _configureServices?.Invoke(services);
                services.EnsureDbCreated<AppDbContext>();
            }
        );
    }
}

public static class ServiceCollectionExtensions
{
    public static void RemoveDbContext<T>(this IServiceCollection services)
        where T : DbContext
    {
        var descriptor = services.SingleOrDefault(x =>
            x.ServiceType == typeof(DbContextOptions<T>)
        );
        if (descriptor != null)
        {
            services.Remove(descriptor);
        }
    }

    public static void EnsureDbCreated<T>(this IServiceCollection services)
        where T : DbContext
    {
        using var scope = services.BuildServiceProvider().CreateScope();
        var serviceProvider = scope.ServiceProvider;
        var context = serviceProvider.GetRequiredService<T>();
        context.Database.Migrate();
    }
}
