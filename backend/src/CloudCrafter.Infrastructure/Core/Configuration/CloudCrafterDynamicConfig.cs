namespace CloudCrafter.Infrastructure.Core.Configuration;

public class CloudCrafterDynamicConfig
{
    // TODO: Move this to a database or something, no env vars because they should be able to change on the fly
    public readonly string DataDir = "/data/cloudcrafter";
}
