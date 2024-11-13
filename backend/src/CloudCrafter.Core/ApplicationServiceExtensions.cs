using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.BackgroundServices;
using CloudCrafter.Core.Common.Behaviours;
using CloudCrafter.Core.Events;
using CloudCrafter.Core.Events.Store;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Jobs.Hangfire;
using CloudCrafter.Core.Jobs.Serializer;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Core.Jobs.Stacks;
using CloudCrafter.Core.Services.Core;
using CloudCrafter.Core.Services.Domain.Agent;
using CloudCrafter.Core.Services.Domain.Applications.Deployments;
using CloudCrafter.Core.Services.Domain.Environments;
using CloudCrafter.Core.Services.Domain.Projects;
using CloudCrafter.Core.Services.Domain.Servers;
using CloudCrafter.Core.Services.Domain.Stacks;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Core.Services.Domain.Utils;
using CloudCrafter.Core.SignalR;
using CloudCrafter.Core.SignalR.HubActions;
using CloudCrafter.Core.SignalR.Tracking;
using CloudCrafter.Domain;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using FluentValidation;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace CloudCrafter.Core;

public static class ApplicationServiceExtensions
{
    public static IApplicationBuilder ConfigureRecurringJobs(this IApplicationBuilder app)
    {
#if !IN_TESTS
        var isInTests = Environment.GetEnvironmentVariable("IN_TESTS");
        if (isInTests == "true")
        {
            return app;
        }
        RecurringJob.AddOrUpdate<ICloudCrafterRecurringJobsDispatcher>(
            "5m-recurring-connectivity-checks",
            service => service.AddRecurringConnectivityChecks(),
            "*/5 * * * *"
        );

        RecurringJob.AddOrUpdate<ICloudCrafterRecurringJobsDispatcher>(
            "5m-recurring-stacks-health-checks-missing",
            service => service.AddMarkStacksAsUnknownWhenTimespanExceeded(),
            "*/5 * * * *"
        );
        RecurringJob.AddOrUpdate<ICloudCrafterRecurringJobsDispatcher>(
            "1m-recurring-healthyness-checks",
            service => service.AddRecurringHealthynessChecks(),
            "*/1 * * * *"
        );

#endif
        return app;
    }

    public static IServiceCollection AddDomainEvents(
        this IServiceCollection services,
        params Assembly[] assemblies
    )
    {
        var handlerType = typeof(IDomainEventHandler<>);

        var handlers = assemblies
            .SelectMany(a => a.GetTypes())
            .Where(t =>
                t.GetInterfaces()
                    .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == handlerType)
            );

        foreach (var handler in handlers)
        {
            var handlerInterface = handler
                .GetInterfaces()
                .First(i => i.IsGenericType && i.GetGenericTypeDefinition() == handlerType);

            services.AddTransient(handlerInterface, handler);
        }

        services.AddSingleton<IEventStore, EventStore>();
        return services;
    }

    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var mapperAssemblies = new List<Assembly>
        {
            Assembly.GetExecutingAssembly(),
            typeof(IDomainTarget).Assembly,
        };

        services.AddAutoMapper(mapperAssemblies);

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddSingleton<HangfireServerSelector>();
        services.AddHostedService<HangfireServerMonitorService>();
        services.AddHostedService<DummyDataService>();
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
            cfg.AddBehavior(
                typeof(IPipelineBehavior<,>),
                typeof(ServerAccessAuthorizationBehavior<,>)
            );
        });

        services.AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();

        services.AddTransient<PresenceTracker>();
        services.AddScoped<ICommandExecutor, CommandExecutor>();
        services
            .AddScoped<IUsersService, UsersService>()
            .AddScoped<IServersService, ServersService>()
            .AddScoped<IUserAccessService, UserAccessService>()
            .AddScoped<IServerConnectivityService, ServerConnectivityService>()
            .AddScoped<IProjectsService, ProjectsService>()
            .AddScoped<IStacksService, StacksService>()
            .AddScoped<IStackServicesService, StackServicesService>()
            .AddScoped<IAgentManager, AgentManager>()
            .AddScoped<IEnvironmentService, EnvironmentsService>()
            .AddScoped<IGitService, GitService>()
            .AddScoped<IDeploymentService, DeploymentService>();

        // Jobs

        services.AddScoped<ICloudCrafterDispatcher, CloudCrafterDispatcher>();
        services.AddScoped<
            ICloudCrafterRecurringJobsDispatcher,
            CloudCrafterRecurringJobsDispatcher
        >();
        services.AddScoped<BackgroundJobFactory>();
        services.AddSingleton<JobSerializer>();
        services.AddSingleton<ConnectedServerManager>();

        services.AddTransient<WebHubActions>();
        services.AddTransient<StackHubActions>();

        services.AddScoped<ConnectivityCheckBackgroundJob>();
        services.AddScoped<DeployStackBackgroundJob>();

        var connectionString = configuration.GetConnectionString("RedisConnection");

        if (connectionString is null)
        {
            throw new InvalidOperationException("Redis connection string is not configured");
        }

        services
            .AddSignalR()
            .AddStackExchangeRedis(
                connectionString,
                opt =>
                {
                    opt.Configuration.ChannelPrefix = RedisChannel.Literal("CloudCrafter-WS");
                }
            );

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = connectionString;
            options.InstanceName = "CloudCrafter-Cache";
        });

        services.AddSingleton<IDistributedLockService>(sp => new DistributedLockService(
            connectionString
        ));
        return services;
    }
}
