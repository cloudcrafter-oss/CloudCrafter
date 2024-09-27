using CloudCrafter.Core.Interfaces;

namespace CloudCrafter.Web.Infrastructure.Services;

public class WebCloudCrafterEnvironmentConfig : ICloudCrafterEnvironmentConfig
{
    public bool IsApiHost()
    {
        return true;
    }
}
