using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using FluentValidation;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables.Validation;

/// <summary>
///     Validator for CreateStackEnvironmentVariableGroupCommand
/// </summary>
public class CreateStackEnvironmentVariableGroupCommandValidator
    : AbstractValidator<CreateStackEnvironmentVariableGroupCommand>
{
    public CreateStackEnvironmentVariableGroupCommandValidator()
    {
        RuleFor(x => x.StackId).NotEmpty().WithMessage("Stack ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Group name is required")
            .MaximumLength(100)
            .WithMessage("Group name cannot exceed 100 characters")
            .Matches("^[A-Za-z0-9 _-]+$")
            .WithMessage(
                "Group name can only contain letters, numbers, spaces, underscores, and hyphens"
            );

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters")
            .When(x => x.Description != null);
    }
}
