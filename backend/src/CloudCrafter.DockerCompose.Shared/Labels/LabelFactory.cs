using CloudCrafter.Shared.Deployment.Docker.Labels;

namespace CloudCrafter.DockerCompose.Shared.Labels;

public abstract class LabelFactory
{
    public static CloudCrafterLabel GenerateApplicationLabel(Guid applicationId)
    {
        var label = new CloudCrafterLabel(CloudCrafterLabelKey.ApplicationId, applicationId.ToString());
        return label;
    }

    public static CloudCrafterLabel GenerateDeploymentLabel(Guid deploymentId)
    {
        return new CloudCrafterLabel(CloudCrafterLabelKey.DeploymentId, deploymentId.ToString());
    }
}
