using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class NixpacksDetermineBuildPackValidator
    : AbstractValidator<NixpacksDetermineBuildPackParams>
{
    public NixpacksDetermineBuildPackValidator()
    {
        RuleFor(x => x.Path).NotNull();
    }
}
