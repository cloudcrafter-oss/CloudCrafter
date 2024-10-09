using CloudCrafter.Jobs.Service.Services;
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
        services.AddSingleton<HangfireServerSelector>();
        services.AddHostedService<HangfireServerMonitorService>();
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
                opt.Queues = queues;
                opt.ServerName = machineName;
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
