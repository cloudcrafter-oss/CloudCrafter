using CloudCrafter.DeploymentEngine.Remote.Manager;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.DeploymentEngine.Remote;

public static class RemoteExtensions
{
    public static IServiceCollection AddEngineInfrastructure(
        this IServiceCollection services)
    {

        services.AddTransient<ICloudCrafterEngineManagerFactory, CloudCrafterEngineManagerFactory>();

        return services;
    }
}
