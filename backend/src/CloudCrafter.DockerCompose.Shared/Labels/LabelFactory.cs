using CloudCrafter.Shared.Deployment.Docker.Labels;

namespace CloudCrafter.DockerCompose.Shared.Labels;

public abstract class LabelFactory
{
    public static CloudCrafterLabel GenerateManagedLabel()
    {
        return new CloudCrafterLabel(CloudCrafterLabelKey.CloudCrafterManaged, "true");
    }

    public static CloudCrafterLabel GenerateStackLabel(Guid stackId)
    {
        var label = new CloudCrafterLabel(CloudCrafterLabelKey.StackId, stackId.ToString());
        return label;
    }

    public static CloudCrafterLabel GenerateStackServiceLabel(Guid stackServiceId)
    {
        return new CloudCrafterLabel(CloudCrafterLabelKey.StackServiceId, stackServiceId.ToString());
    }

    public static CloudCrafterLabel GenerateDeploymentLabel(Guid deploymentId)
    {
        return new CloudCrafterLabel(CloudCrafterLabelKey.DeploymentId, deploymentId.ToString());
    }
}
