using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Behaviours;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Core.Jobs.Dispatcher.Factory;
using CloudCrafter.Core.Services.Domain.Applications.Deployments;
using CloudCrafter.Core.Services.Domain.Projects;
using CloudCrafter.Core.Services.Domain.Servers;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var mapperAssemblies = new List<Assembly> { Assembly.GetExecutingAssembly(), typeof(IDomainTarget).Assembly };

        services.AddAutoMapper(mapperAssemblies);

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        });

        services.AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();


        services.AddScoped<IUsersService, UsersService>()
            .AddScoped<IServersService, ServersService>()
            .AddScoped<IProjectsService, ProjectsService>()
            .AddScoped<IDeploymentService, DeploymentService>();

        // Jobs

        services.AddScoped<ICloudCrafterDispatcher, CloudCrafterDispatcher>();
        services.AddScoped<BackgroundJobFactory>();

        return services;
    }
}
