using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class GitCheckoutFromSourceProviderParamsValidator
    : AbstractValidator<GitCheckoutFromSourceProviderParams>
{
    public GitCheckoutFromSourceProviderParamsValidator()
    {
        RuleFor(x => x.AccessToken).NotEmpty().MinimumLength(3);
        RuleFor(x => x.Repository).NotEmpty();
        RuleFor(x => x.Branch).NotEmpty();
    }
}
