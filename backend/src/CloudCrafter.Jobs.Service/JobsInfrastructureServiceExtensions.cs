using Hangfire;
using Hangfire.Console;
using Hangfire.Redis.StackExchange;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

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
        var connectionString = config.GetConnectionString("RedisConnection");
        if (connectionString == null)
        {
            throw new ArgumentNullException(
                "RedisConnection",
                "Redis connection string is required"
            );
        }
        var redis = ConnectionMultiplexer.Connect(connectionString!);
        services.AddSingleton<IConnectionMultiplexer>(redis);

        services.AddHangfire(
            (sp, hangfireConfig) =>
            {
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
                try
                {
                    hangfireConfig.UseConsole();
                }
                catch (InvalidOperationException ex)
                    when (ex.Message.Contains("Console is already initialized")) // Fix for tests
                { }
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
