using CloudCrafter.Agent.Models.Deployment.Steps;
using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators.Container;

public class StopContainersValidator : AbstractValidator<StopContainersParams>
{
    private static readonly List<string> AllowedFilterKeys = new() { "labels" };

    public StopContainersValidator()
    {
        RuleFor(x => x.Filters)
            .NotEmpty()
            .WithMessage("At least one filter must be provided.")
            .Must(filters => filters.Keys.All(key => AllowedFilterKeys.Contains(key)))
            .WithMessage(
                $"Filters must only contain the following keys: {string.Join(", ", AllowedFilterKeys)}"
            );

        When(
            x => x.Filters.ContainsKey("labels"),
            () =>
            {
                RuleFor(x => x.Filters["labels"])
                    .NotEmpty()
                    .WithMessage("Label filters list cannot be empty when 'labels' key is present.")
                    .ForEach(labelRule =>
                    {
                        labelRule
                            .Must(label => DockerLabelFilter.TryParse(label, out _))
                            .WithMessage(
                                (_, label) =>
                                    $"'{label}' is not a valid Docker label filter. It should be in the format 'key=value' or 'key!=value'."
                            );
                    });
            }
        );
    }
}

[DeploymentStep(DeploymentBuildStepType.StopContainers)]
public class StopContainersConfig : IDeploymentStepConfig<StopContainersParams>
{
    public IValidator<StopContainersParams> Validator => new StopContainersValidator();
}
