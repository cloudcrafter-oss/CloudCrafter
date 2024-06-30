using System.Reflection;
using Ardalis.GuardClauses;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Interfaces;
using CloudCrafter.Core.Services;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Data.Queries;
using CloudCrafter.Infrastructure.Email;
using CloudCrafter.Infrastructure.Identity;
using CloudCrafter.Infrastructure.Identity.Services;
using CloudCrafter.UseCases.Contributors.List;
using CloudCrafter.UseCases.Domain.Auth.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Infrastructure;

public static class InfrastructureServiceExtensions
{
    
    public static IServiceCollection AddCloudCrafterApplicationServices(this IServiceCollection services,
        ConfigurationManager config)
    {

       // services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        return services;
    }
    public static IServiceCollection AddCloudCrafterConfiguration(this IServiceCollection services,
        ConfigurationManager config)
    {

        services.AddOptions<JwtSettings>()
            .BindConfiguration(JwtSettings.KEY)
            .ValidateDataAnnotations()
            .ValidateOnStart();
        
        services.AddOptions<CorsSettings>()
            .BindConfiguration(CorsSettings.KEY)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        return services;
    }
    public static IServiceCollection AddCloudCrafterIdentity(this IServiceCollection services,
        ConfigurationManager config)
    {
        string? connectionString = config.GetConnectionString("PostgresConnection");
        Guard.Against.Null(connectionString, "PostgresConnection is not set.");

        services.AddDbContext<AppIdentityDbContext>(options =>
        {
            options.UseNpgsql(connectionString, opt =>
            {
                //opt.MigrationsHistoryTable("EntityFrameworkMigrations");
            });
        });

        services.AddIdentity<User, Role>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppIdentityDbContext>();

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        ConfigurationManager config,
        ILogger logger)
    {
        string? connectionString = config.GetConnectionString("PostgresConnection");
        Guard.Against.Null(connectionString, "PostgresConnection is not set.");

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(connectionString, opt =>
            {
                //opt.MigrationsHistoryTable("EntityFrameworkMigrations");
            });
        });

        services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
        services.AddScoped(typeof(IReadRepository<>), typeof(EfRepository<>));
        services.AddScoped<IListContributorsQueryService, ListContributorsQueryService>();
        services.AddScoped<IDeleteContributorService, DeleteContributorService>();

        services.AddScoped<ICloudCrafterAuthService, CloudCrafterAuthService>();
        services.AddScoped<IJwtService, JwtService>();

        services.Configure<MailserverConfiguration>(config.GetSection("Mailserver"));

        logger.LogInformation("{Project} services registered", "Infrastructure");

        return services;
    }
}
