using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators.Container;

public class ContainerHealthCheckValidator : AbstractValidator<ContainerHealthCheckParams>
{
    public ContainerHealthCheckValidator()
    {
        RuleFor(x => x.ContainerName).NotEmpty();
        RuleFor(x => x.Options).NotNull();

        When(x => x.Options != null, () =>
        {
            RuleFor(x => x.Options!).SetValidator(new ContainerHealthCheckParamsOptionsValidator());
        });
    }
}

public class ContainerHealthCheckParamsOptionsValidator : AbstractValidator<ContainerHealthCheckParamsOptions>
{
    public ContainerHealthCheckParamsOptionsValidator()
    {
        RuleFor(x => x.HttpMethod).NotEmpty();
        RuleFor(x => x.HttpSchema).NotEmpty();
        RuleFor(x => x.HttpHost).NotEmpty();
        RuleFor(x => x.HttpPort).NotNull()
            .GreaterThan(0);

        RuleFor(x => x.ExpectedResponseCode)
            .NotNull()
            .GreaterThan(0);

        RuleFor(x => x.CheckInterval)
            .NotNull()
            .GreaterThan(0);

        RuleFor(x => x.CheckTimeout)
            .NotNull()
            .GreaterThan(0);

        RuleFor(x => x.Retries)
            .NotNull()
            .GreaterThan(0);

        RuleFor(x => x.BackOffPeriod)
            .NotNull()
            .GreaterThan(-1); // not negative 
    }
}

[DeploymentStep(DeploymentBuildStepType.ContainerHealthCheck)]
public class ContainerHealthCheckConfig : IDeploymentStepConfig<ContainerHealthCheckParams>
{
    public IValidator<ContainerHealthCheckParams> Validator => new ContainerHealthCheckValidator();
}
