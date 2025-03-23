using System.Text.RegularExpressions;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Domain.Entities;
using FluentValidation;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables.Validation;

/// <summary>
/// Validator for UpdateStackEnvironmentVariableCommand
/// </summary>
public class UpdateStackEnvironmentVariableCommandValidator
    : AbstractValidator<UpdateStackEnvironmentVariableCommand>
{
    private static readonly Regex KeyFormatRegex = new("^[A-Z][A-Z0-9_]*$", RegexOptions.Compiled);

    public UpdateStackEnvironmentVariableCommandValidator()
    {
        // ID validation
        RuleFor(x => x.Id).NotEmpty().WithMessage("Environment variable ID is required");

        // Stack ID validation
        RuleFor(x => x.StackId).NotEmpty().WithMessage("Stack ID is required");

        // Key validations
        RuleFor(x => x.Key).NotEmpty().WithMessage("Environment variable key is required");

        RuleFor(x => x.Key)
            .Must(key => KeyFormatRegex.IsMatch(key))
            .When(x => !string.IsNullOrEmpty(x.Key))
            .WithMessage(
                "Key must start with a capital letter and contain only uppercase letters, numbers, and underscores"
            );

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
