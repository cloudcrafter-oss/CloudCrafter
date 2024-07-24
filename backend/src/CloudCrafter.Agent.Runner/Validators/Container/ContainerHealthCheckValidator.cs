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
        RuleFor(x => x.Services)
            .ForEach(service => service.SetValidator(new ContainerHealthCheckParamsServiceValidator()));
    }
}
public class ContainerHealthCheckParamsServiceValidator : AbstractValidator<KeyValuePair<string, ContainerHealthCheckParamsOptions>>
{
    public ContainerHealthCheckParamsServiceValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty()
            .WithMessage("Service name is required.");

        RuleFor(x => x.Value)
            .NotEmpty()
            .WithMessage("Service healthcheck options are required.")
            .SetValidator(new ContainerHealthCheckParamsOptionsValidator());
    }
}

public class ContainerHealthCheckParamsOptionsValidator : AbstractValidator<ContainerHealthCheckParamsOptions>
{
    public ContainerHealthCheckParamsOptionsValidator()
    {
        RuleFor(x => x.CheckForDockerHealth)
            .NotNull().When(x => !HasHttpChecks(x))
            .WithMessage("Either CheckForDockerHealth or HTTP checks must be specified.");

        RuleFor(x => x.HttpMethod)
            .NotEmpty().When(HasHttpChecks)
            .WithMessage("HTTP method is required when specifying HTTP checks.");

        RuleFor(x => x.HttpSchema)
            .NotEmpty().When(HasHttpChecks)
            .WithMessage("HTTP schema is required when specifying HTTP checks.");

        RuleFor(x => x.HttpHost)
            .NotEmpty().When(HasHttpChecks)
            .WithMessage("HTTP host is required when specifying HTTP checks.");
        
        RuleFor(x => x.HttpPath)
            .NotEmpty().When(HasHttpChecks)
            .WithMessage("HTTP path is required when specifying HTTP checks.");

        RuleFor(x => x.HttpPort)
            .NotNull().When(HasHttpChecks)
            .WithMessage("HTTP port is required when specifying HTTP checks.");

        RuleFor(x => x.ExpectedResponseCode)
            .NotNull().When(HasHttpChecks)
            .WithMessage("Expected response code is required when specifying HTTP checks.");

        RuleFor(x => x.CheckInterval)
            .GreaterThan(0).When(x => x.CheckInterval.HasValue)
            .WithMessage("Check interval must be greater than 0.");

        RuleFor(x => x.CheckTimeout)
            .GreaterThan(0).When(x => x.CheckTimeout.HasValue)
            .WithMessage("Check timeout must be greater than 0.");

        RuleFor(x => x.Retries)
            .GreaterThanOrEqualTo(0).When(x => x.Retries.HasValue)
            .WithMessage("Retries must be greater than or equal to 0.");

        RuleFor(x => x.BackOffPeriod)
            .GreaterThan(0).When(x => x.BackOffPeriod.HasValue)
            .WithMessage("Back-off period must be greater than 0.");
    }

    private bool HasHttpChecks(ContainerHealthCheckParamsOptions options)
    {
        return !string.IsNullOrEmpty(options.HttpMethod) ||
               !string.IsNullOrEmpty(options.HttpSchema) ||
               !string.IsNullOrEmpty(options.HttpHost) ||
               options.HttpPort.HasValue;
    }
}

[DeploymentStep(DeploymentBuildStepType.ContainerHealthCheck)]
public class ContainerHealthCheckConfig : IDeploymentStepConfig<ContainerHealthCheckParams>
{
    public IValidator<ContainerHealthCheckParams> Validator => new ContainerHealthCheckValidator();
}
