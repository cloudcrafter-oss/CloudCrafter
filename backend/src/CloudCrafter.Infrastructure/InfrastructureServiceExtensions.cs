using System.Text;
using Ardalis.GuardClauses;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Email;
using CloudCrafter.Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace CloudCrafter.Infrastructure;

public static class InfrastructureServiceExtensions
{

    public static IServiceCollection AddCloudCrafterIdentity(this IServiceCollection services,
        ConfigurationManager config)
    {
        var connectionString = config.GetConnectionString("PostgresConnection");
        Guard.Against.Null(connectionString, "PostgresConnection is not set.");


        services.AddIdentity<User, Role>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>();


        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        ConfigurationManager config)
    {
        var connectionString = config.GetConnectionString("PostgresConnection");
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


        // var jwtConfig = new JwtSettings();
        // config.Bind(JwtSettings.KEY, jwtConfig);
        //
        // // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        //     .AddJwtBearer(x =>
        //     {
        //         x.TokenValidationParameters = new TokenValidationParameters
        //         {
        //             ValidIssuer = jwtConfig.Issuer,
        //             ValidAudience = jwtConfig.Audience,
        //             IssuerSigningKey =
        //                 new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.SecretKey)),
        //             ValidateIssuer = true,
        //             ValidateAudience = true,
        //             ValidateLifetime = true,
        //             ValidateIssuerSigningKey = true
        //         };
        //         
        //         x.Events = new JwtBearerEvents()
        //         {
        //             OnMessageReceived = msg =>
        //             {
        //                 var token = msg?.Request.Headers.Authorization.ToString();
        //                 string path = msg?.Request.Path ?? "";
        //                 if (!string.IsNullOrEmpty(token))
        //
        //                 {
        //                     Console.WriteLine("Access token");
        //                     Console.WriteLine($"URL: {path}");
        //                     Console.WriteLine($"Token: {token}\r\n");
        //                 }
        //                 else
        //                 {
        //                     Console.WriteLine("Access token");
        //                     Console.WriteLine("URL: " + path);
        //                     Console.WriteLine("Token: No access token provided\r\n");
        //                 }
        //                 return Task.CompletedTask;
        //             }
        //         };
        //     });

        // services.AddAuthorizationBuilder();
        //
        //
        // services.AddAuthorization(options =>
        //     options.AddPolicy("canpurge", policy => policy.RequireRole("admin")));
        //

         services.AddCloudCrafterIdentity(config);

        return services;
    }
}
