namespace CloudCrafter.Shared.Deployment.Docker.Labels;


public class CloudCrafterLabel(CloudCrafterLabelKey Key, string Value)
{
    private string GetLabelKey()
    {
        switch (Key)
        {
            case CloudCrafterLabelKey.ApplicationId:
                return CloudCrafterLabelKeys.ApplicationId;
            case CloudCrafterLabelKey.DeploymentId:
                return CloudCrafterLabelKeys.DeploymentId;
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
    ApplicationId,
    DeploymentId
}
