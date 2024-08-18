using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

[DeploymentStep(DeploymentBuildStepType.RunPlainCommand)]
// ReSharper disable once ClassNeverInstantiated.Global
public class RunPlainCommandParams
{
    public bool? AllowFailure { get; init; } = false;
    public string Command { get; init; } = string.Empty;
}
