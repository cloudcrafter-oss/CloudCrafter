using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Factories;

public interface IDeploymentStep<in TParams>
{
    Task ExecuteAsync(TParams pameters, DeploymentContext context);
    Task DryRun(TParams parameters, DeploymentContext context);

    IValidator<TParams> Validator { get; }
    DeploymentBuildStepType Type { get; }
}

public class DeploymentStepMeta : IDeploymentStep<GitCheckoutParams>
{
    public class GitCheckoutParamsValidator : AbstractValidator<GitCheckoutParams>
    {
        public GitCheckoutParamsValidator()
        {
            RuleFor(x => x.Commit).NotEmpty();
            RuleFor(x => x.Repo).NotEmpty();
        }
    }

    public Task ExecuteAsync(GitCheckoutParams pameters, DeploymentContext context)
    {
        throw new NotImplementedException();
    }

    public Task DryRun(GitCheckoutParams parameters, DeploymentContext context)
    {
        throw new NotImplementedException();
    }

    public IValidator<GitCheckoutParams> Validator => new GitCheckoutParamsValidator();
    public DeploymentBuildStepType Type => DeploymentBuildStepType.FetchGitRepository;
}
