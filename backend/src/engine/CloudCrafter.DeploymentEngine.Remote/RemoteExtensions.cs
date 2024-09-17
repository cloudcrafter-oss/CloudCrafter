using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;
using CloudCrafter.DeploymentEngine.Remote.Clients.Helpers;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.DeploymentEngine.Remote;

public static class RemoteExtensions
{
    public static IServiceCollection AddEngineInfrastructure(this IServiceCollection services)
    {
        services.AddTransient<
            ICloudCrafterEngineManagerFactory,
            CloudCrafterEngineManagerFactory
        >();

        services.AddSingleton<ICommonCommandGenerator, CommonCommandGenerator>();

        return services;
    }
}
