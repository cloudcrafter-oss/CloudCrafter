using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Behaviours;
using CloudCrafter.Core.Events;
using CloudCrafter.Core.Events.Store;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Jobs.Serializer;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Core.Jobs.Stacks;
using CloudCrafter.Core.Services.Domain.Applications.Deployments;
using CloudCrafter.Core.Services.Domain.Environments;
using CloudCrafter.Core.Services.Domain.Projects;
using CloudCrafter.Core.Services.Domain.Servers;
using CloudCrafter.Core.Services.Domain.Stacks;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Core.Services.Domain.Utils;
using CloudCrafter.Domain;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using FluentValidation;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core;

public static class ApplicationServiceExtensions
{
    public static IApplicationBuilder ConfigureRecurringJobs(this IApplicationBuilder app)
    {
        RecurringJob.AddOrUpdate<ICloudCrafterRecurringJobsDispatcher>(
            "5m-recurring-connectivity-checks",
            service => service.AddRecurringConnectivityChecks(),
            "*/5 * * * *"
        );
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

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var mapperAssemblies = new List<Assembly>
        {
            Assembly.GetExecutingAssembly(),
            typeof(IDomainTarget).Assembly,
        };

        services.AddAutoMapper(mapperAssemblies);

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

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

        services.AddScoped<ICommandExecutor, CommandExecutor>();
        services
            .AddScoped<IUsersService, UsersService>()
            .AddScoped<IServersService, ServersService>()
            .AddScoped<IUserAccessService, UserAccessService>()
            .AddScoped<IServerConnectivityService, ServerConnectivityService>()
            .AddScoped<IProjectsService, ProjectsService>()
            .AddScoped<IStacksService, StacksService>()
            .AddScoped<IStackServicesService, StackServicesService>()
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

        services.AddScoped<ConnectivityCheckBackgroundJob>();
        services.AddScoped<DeployStackBackgroundJob>();

        // SignalR
        services.AddSignalR();

        return services;
    }
}
