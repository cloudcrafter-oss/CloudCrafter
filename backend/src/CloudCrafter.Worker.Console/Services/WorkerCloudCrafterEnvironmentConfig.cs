using CloudCrafter.Core.Interfaces;

namespace CloudCrafter.Worker.Console.Services;

public class WorkerCloudCrafterEnvironmentConfig : ICloudCrafterEnvironmentConfig
{
    public bool IsApiHost()
    {
        return false;
    }
}
