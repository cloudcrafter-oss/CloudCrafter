using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Core;

namespace CloudCrafter.Infrastructure.Logging;

public static class LoggingConfiguration
{
    public static Logger GetLogger()
    {
        return new LoggerConfiguration()
            .WriteTo.Console()
            .CreateLogger();
    }

    public static IServiceCollection AddCloudCrafterLogging(
        this IServiceCollection services,
        ConfigurationManager config)
    {
        services.AddSerilog(opt =>
        {
            opt.ReadFrom.Configuration(config);
        });
        return services;
    }
}
