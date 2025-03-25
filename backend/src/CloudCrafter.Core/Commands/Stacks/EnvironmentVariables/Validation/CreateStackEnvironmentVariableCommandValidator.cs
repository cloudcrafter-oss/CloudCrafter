using FluentValidation;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables.Validation;

/// <summary>
///     Validator for CreateStackEnvironmentVariableCommand
/// </summary>
public class CreateStackEnvironmentVariableCommandValidator
    : AbstractValidator<CreateStackEnvironmentVariableCommand>
{
    public CreateStackEnvironmentVariableCommandValidator()
    {
        // Stack ID validation
        RuleFor(x => x.StackId).NotEmpty().WithMessage("Stack ID is required");

        // Key validations
        RuleFor(x => x.Key).NotEmpty().WithMessage("Environment variable key is required");
        RuleFor(x => x.Value).NotEmpty().WithMessage("Environment variable value is required");
        RuleFor(x => x.Key).MaximumLength(100).WithMessage("Key must not exceed 100 characters");

        // Value validations
        RuleFor(x => x.Value)
            .MaximumLength(2000)
            .WithMessage("Value must not exceed 2000 characters");

        // Type validation
        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Environment variable type must be valid (BuildTime, Runtime, or Both)");
    }
}
