using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Core;

namespace CloudCrafter.Infrastructure.Logging;

public static class LoggingConfiguration
{
    public static Logger GetLogger(IConfiguration? config = null)
    {
        var loggerConfig = new LoggerConfiguration();
        
        if (config != null)
        {
            loggerConfig = loggerConfig.ReadFrom.Configuration(config);
        }
        
        return loggerConfig
            .CreateLogger();
     
    }

    public static IServiceCollection AddCloudCrafterLogging(
        this IServiceCollection services,
        IConfiguration config)
    {
        Log.Logger = GetLogger(config);

        services.AddLogging(logger =>
        {
            logger.ClearProviders();
            logger.AddSerilog();
        });
        
        return services;
    }
}
