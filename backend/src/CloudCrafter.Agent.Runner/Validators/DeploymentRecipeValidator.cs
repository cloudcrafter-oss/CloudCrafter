using CloudCrafter.Agent.Models.Recipe;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators;

public class DeploymentRecipeValidator : AbstractValidator<DeploymentRecipe>
{
    public DeploymentRecipeValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Destination).NotNull()
            .SetValidator(new DeploymentRecipeDestinationValidator());
        RuleFor(x => x.BuildOptions).NotNull()
            .SetValidator(new DeploymentBuildOptionsValidator());

        When(x => x.DockerComposeOptions != null, () =>
        {
            RuleFor(x => x.DockerComposeOptions!).SetValidator(new DeploymentRecipeDockerComposeOptionsValidator());
        });
    }
}

public class DeploymentRecipeDestinationValidator : AbstractValidator<DeploymentRecipeDestination>
{
    public DeploymentRecipeDestinationValidator()
    {
        RuleFor(x => x.RootDirectory)
            .NotEmpty();
    }
}

public class DeploymentBuildOptionsValidator : AbstractValidator<DeploymentBuildOptions>
{
    public DeploymentBuildOptionsValidator()
    {
        RuleFor(x => x.Steps)
            .NotEmpty();
    }
}

public class DeploymentRecipeDockerComposeOptionsValidator : AbstractValidator<DeploymentRecipeDockerComposeOptions>
{
    public DeploymentRecipeDockerComposeOptionsValidator()
    {
        RuleFor(x => x.Base64DockerCompose).NotEmpty()
            .Must(BeValidBase64).WithMessage("Docker Compose must be a valid base64 string");

        RuleFor(x => x.DockerComposeDirectory).NotEmpty();
    }
    
    private bool BeValidBase64(string? base64String)
    {
        if (string.IsNullOrWhiteSpace(base64String))
            return false;

        try
        {
            // ReSharper disable once ReturnValueOfPureMethodIsNotUsed
            Convert.FromBase64String(base64String);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
