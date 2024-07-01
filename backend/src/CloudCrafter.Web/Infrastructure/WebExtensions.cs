using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Repositories;
using CloudCrafter.Web.Infrastructure.Services;

namespace CloudCrafter.Web.Infrastructure;

public static class WebExtensions
{
    public static IServiceCollection AddWebConfig(this IServiceCollection services, ConfigurationManager config)
    {
        services.AddCors(options =>
        {
            var corsSettings = new CorsSettings();
            config.Bind(CorsSettings.KEY, corsSettings);

            options.AddPolicy("DefaultCorsPolicy", corsBuilder =>
            {
                corsBuilder.WithOrigins(corsSettings.AllowedOrigins.ToArray())
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        services.AddExceptionHandler<CustomExceptionHandler>()
            .AddScoped<IUser, CurrentUser>()
            .AddScoped<IUserRepository, UserRepository>();
        return services;
    }
}
