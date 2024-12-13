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
        RuleFor(x => x.Commit).NotEmpty();
        RuleFor(x => x.Repo).NotEmpty();
    }
}

//[DeploymentStep(DeploymentBuildStepType.FetchGitRepositoryFromProvider)]
public class GitCheckoutFromSourceProviderConfig
    : IDeploymentStepConfig<GitCheckoutFromSourceProviderParams>
{
    public IValidator<GitCheckoutFromSourceProviderParams> Validator =>
        new GitCheckoutFromSourceProviderParamsValidator();
}
