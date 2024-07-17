using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class GitCheckoutParamsValidator : AbstractValidator<GitCheckoutParams>
{
    public GitCheckoutParamsValidator()
    {
        RuleFor(x => x.Branch).NotEmpty();
        RuleFor(x => x.Repo).NotEmpty();
    }
}

public class GitCheckoutConfig : IDeploymentStepConfig<GitCheckoutParams>
{
    public IValidator<GitCheckoutParams> Validator => new GitCheckoutParamsValidator();
}
