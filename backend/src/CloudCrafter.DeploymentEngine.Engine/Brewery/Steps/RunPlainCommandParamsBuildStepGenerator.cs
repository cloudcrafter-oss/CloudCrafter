using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;

public class RunPlainCommandParamsBuildStepGenerator(RunPlainCommandParamsBuildStepGenerator.Args args)
    : IBuildStepGenerator
{
    public DeploymentBuildStep Generate()
    {
        return new DeploymentBuildStep
        {
            Name = "Run plain command",
            Description = "Runs a plain command",
            Type = DeploymentBuildStepType.RunPlainCommand,
            Params = new Dictionary<string, object>
            {
                { "command", args.Command }, { "allowFailure", args.AllowFailure }
            }
        };
    }

    public class Args
    {
        public required string Command { get; init; }
        public required bool AllowFailure { get; init; }
    }
}
