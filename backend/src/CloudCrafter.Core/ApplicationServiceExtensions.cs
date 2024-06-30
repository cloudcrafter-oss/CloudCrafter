using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Behaviours;
using CloudCrafter.Core.ContributorAggregate;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, Assembly?[] assemblies)
    {
        var combinedAssemblies = assemblies.Append(Assembly.GetExecutingAssembly());
       
        services.AddAutoMapper(combinedAssemblies);

        //services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
     
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        });
        services.AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();

        return services;
    }
}
