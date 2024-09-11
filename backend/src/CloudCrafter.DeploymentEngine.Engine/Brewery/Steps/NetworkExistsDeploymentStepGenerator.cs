using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class NetworkExistsDeploymentStepGenerator(string networkName) : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = $"Check if network '{networkName}' exists",
            Description =
                "Validates if the network exists. If it does not, create the network regardless",
            Type = DeploymentBuildStepType.DockerValidateNetworksExists,
            Params = new Dictionary<string, object>
            {
                {
                    "networks",
                    new List<string> { networkName }
                },
            },
        };
    }
}
