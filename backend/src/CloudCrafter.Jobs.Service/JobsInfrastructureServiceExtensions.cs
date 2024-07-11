using CloudCrafter.Jobs.Service.Jobs.Context.Deployments;
using Hangfire;
using Hangfire.Console;
using Hangfire.Redis.StackExchange;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Jobs.Service;

public static class JobsInfrastructureServiceExtensions
{
    public static IServiceCollection AddJobInfrastructure(
        this IServiceCollection services,
        ConfigurationManager config)
    {
        services.AddScoped<IDeploymentTracker, DeploymentTracker>();
        services.AddHangfire((sp, hangfireConfig) =>
        {
            var connectionString = config.GetConnectionString("RedisConnection");


            hangfireConfig.UseRedisStorage(connectionString,
                new RedisStorageOptions { Prefix = "cloudCrafter:", Db = 0, FetchTimeout = TimeSpan.FromSeconds(1) });

            hangfireConfig.UseFilter(new LogEverythingAttribute());


            hangfireConfig
                .UseConsole();
        });

        services.AddHangfireServer();

        return services;
    }
}
