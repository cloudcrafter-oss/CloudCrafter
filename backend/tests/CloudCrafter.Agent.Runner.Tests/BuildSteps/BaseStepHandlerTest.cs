using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Tests.Fakers;

namespace CloudCrafter.Agent.Runner.Tests.BuildSteps;

public class BaseStepHandlerTest<T, TX>
    where T : BaseDeploymentStep<TX>
    where TX : BaseParams
{
    protected DeploymentRecipe GetTestRecipe()
    {
        return AgentFakers.DeploymentRecipeFaker().Generate();
    }
}
