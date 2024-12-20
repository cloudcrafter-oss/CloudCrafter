using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class GitCheckoutFromSourceProviderParamsValidator
    : AbstractValidator<GitCheckoutFromSourceProviderParams>
{
    public GitCheckoutFromSourceProviderParamsValidator()
    {
        RuleFor(x => x.FullPathWithToken).NotEmpty().MinimumLength(3);
        RuleFor(x => x.ProviderPath).NotEmpty().MinimumLength(3);
    }
}
