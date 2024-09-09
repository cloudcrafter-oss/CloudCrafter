namespace CloudCrafter.Shared.Deployment.Docker.Labels;

public class CloudCrafterLabel(CloudCrafterLabelKey Key, string Value)
{
    private string GetLabelKey()
    {
        switch (Key)
        {
            case CloudCrafterLabelKey.StackId:
                return CloudCrafterLabelKeys.StackId;
            case CloudCrafterLabelKey.DeploymentId:
                return CloudCrafterLabelKeys.DeploymentId;
            case CloudCrafterLabelKey.CloudCrafterManaged:
                return CloudCrafterLabelKeys.CloudCrafterManaged;
            case CloudCrafterLabelKey.StackServiceId:
                return CloudCrafterLabelKeys.StackServiceId;
        }

        throw new KeyNotFoundException($"Key not found in CloudCrafterLabel, Key: {Key}");
    }

    public (string, string) ToDockerComposeLabel()
    {
        var labelKey = GetLabelKey();

        return (labelKey, Value);
    }

    public string ToLabelString()
    {
        var labelKey = GetLabelKey();

        return $"{labelKey}={Value}";
    }
}

public enum CloudCrafterLabelKey
{
    StackId,
    StackServiceId,
    DeploymentId,
    CloudCrafterManaged
}
