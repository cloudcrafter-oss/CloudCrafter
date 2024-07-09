using System.Data.Common;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Identity;
using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using Respawn;
using Testcontainers.PostgreSql;
using Xunit;

namespace CloudCrafter.FunctionalTests;

using static Testing;
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly DbConnection _postgreSqlConnection;
    private readonly string _redisConnectionString;

    public CustomWebApplicationFactory(DbConnection postgreSqlConnection, string redisConnectionString)
    {
        _postgreSqlConnection = postgreSqlConnection;
        _redisConnectionString = redisConnectionString;
    }


    /// <summary>
    /// Overriding CreateHost to avoid creating a separate ServiceProvider per this thread:
    /// https://github.com/dotnet-architecture/eShopOnWeb/issues/465
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.UseEnvironment("Development"); // will not send real emails
        var host = builder.Build();
        host.Start();

        // Get service provider. 
        var serviceProvider = host.Services;

        

        return host;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new[]
            {
                new KeyValuePair<string, string?>("ConnectionStrings:RedisConnection", _redisConnectionString)
            });

        });
        builder
            .ConfigureServices(services =>
            {
                // Configure test dependencies here
                services.RemoveDbContext<AppDbContext>();
               

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseNpgsql(_postgreSqlConnection);
                });

                
                services
                    .RemoveAll<IUser>()
                    .AddTransient(provider => Mock.Of<IUser>(s => s.Id == GetUserId()));


                services.EnsureDbCreated<AppDbContext>();
                //// Remove the app's ApplicationDbContext registration.
                //var descriptor = services.SingleOrDefault(
                //d => d.ServiceType ==
                //    typeof(DbContextOptions<AppDbContext>));

                //if (descriptor != null)
                //{
                //  services.Remove(descriptor);
                //}

                //// This should be set for each individual test run
                //string inMemoryCollectionName = Guid.NewGuid().ToString();

                //// Add ApplicationDbContext using an in-memory database for testing.
                //services.AddDbContext<AppDbContext>(options =>
                //{
                //  options.UseInMemoryDatabase(inMemoryCollectionName);
                //});
            });
    }
}

public static class ServiceCollectionExtensions
{
    public static void RemoveDbContext<T>(this IServiceCollection services) where T : DbContext
    {
        var descriptor = services.SingleOrDefault(x => x.ServiceType == typeof(DbContextOptions<T>));
        if (descriptor != null)
        {
            services.Remove(descriptor);
        }
    }

    public static void EnsureDbCreated<T>(this IServiceCollection services) where T : DbContext
    {
        using var scope = services.BuildServiceProvider().CreateScope();
        var serviceProvider = scope.ServiceProvider;
        var context = serviceProvider.GetRequiredService<T>();
        context.Database.Migrate();
    }
}
