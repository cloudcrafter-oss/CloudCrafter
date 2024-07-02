using System.Reflection;
using System.Text;
using Ardalis.GuardClauses;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Services;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Email;
using CloudCrafter.Infrastructure.Identity;
using CloudCrafter.Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

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

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(o =>
            {
                var jwtSettings = new JwtSettings();
                config.Bind(JwtSettings.KEY, jwtSettings);

                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey
                        (Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = false
                };
            });

        services.AddAuthorizationBuilder();
        services.AddIdentity<User, Role>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>();

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

        services.AddScoped<ICloudCrafterAuthService, CloudCrafterAuthService>();
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IJwtService, JwtService>();

        services.AddTransient<IIdentityService, IdentityService>();
        services.Configure<MailserverConfiguration>(config.GetSection("Mailserver"));

        logger.LogInformation("{Project} services registered", "Infrastructure");

        return services;
    }
}
