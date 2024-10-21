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
        IConfiguration config,
        bool withServer,
        JobServiceType type
    )
    {
        services.AddHangfire(
            (sp, hangfireConfig) =>
            {
                var connectionString = config.GetConnectionString("RedisConnection");
                hangfireConfig.UseRedisStorage(
                    connectionString,
                    new RedisStorageOptions
                    {
                        Prefix = "cloudCrafter:",
                        Db = 0,
                        FetchTimeout = TimeSpan.FromSeconds(1),
                    }
                );
                hangfireConfig.UseFilter(new LogEverythingAttribute());

                hangfireConfig.UseSerilogLogProvider();
                hangfireConfig.UseConsole();

                // Add queue configuration
            }
        );

        if (withServer)
        {
            string[] queues = type == JobServiceType.Worker ? ["worker", "default"] : ["web"];

            var machineName = Environment.MachineName;
            services.AddHangfireServer(opt =>
            {
                opt.Queues = [.. queues, machineName];
                opt.ServerName = machineName;
                opt.HeartbeatInterval = TimeSpan.FromSeconds(5);
            });
        }

        return services;
    }
}

public enum JobServiceType
{
    Worker,
    Web,
}
