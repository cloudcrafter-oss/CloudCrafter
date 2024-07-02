using System.Reflection;
using Ardalis.SharedKernel;
using CloudCrafter.Core.Common.Behaviours;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Services.Domain.Users;
using CloudCrafter.Domain;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var domainAssembly = typeof(IDomainTarget).Assembly;
        var currentAssembly = Assembly.GetExecutingAssembly();
        Assembly[] combinedAssemblies = { domainAssembly, currentAssembly };

        services.AddAutoMapper(combinedAssemblies);
        // services.AddHttpClient()

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        });

        // Services
        services.AddScoped<IUsersService, UsersService>();

        services.AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();


        return services;
    }
}
