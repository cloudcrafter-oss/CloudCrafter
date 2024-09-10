using CloudCrafter.DeploymentEngine.Domain.Models;

namespace CloudCrafter.DeploymentEngine.Remote.Manager;

public class CloudCrafterEngineManagerFactory : ICloudCrafterEngineManagerFactory
{
    public CloudCrafterEngineManager CreateFromModel(EngineServerModel model)
    {
        return new CloudCrafterEngineManager(model);
    }
}

public interface ICloudCrafterEngineManagerFactory
{
    CloudCrafterEngineManager CreateFromModel(EngineServerModel model);
}
