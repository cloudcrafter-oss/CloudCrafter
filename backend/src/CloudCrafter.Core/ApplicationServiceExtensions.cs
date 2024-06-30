using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Behaviours;
using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Domain;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, Assembly?[] assemblies)
    {
        // find assembly of IDomainTarget
        var domainAssembly = Assembly.GetAssembly(typeof(IDomainTarget));
        var combinedAssemblies = assemblies.Append(Assembly.GetExecutingAssembly())
            .Append(domainAssembly);
       
        services.AddAutoMapper(combinedAssemblies);

        services.AddScoped<IUsersService, UsersService>();

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