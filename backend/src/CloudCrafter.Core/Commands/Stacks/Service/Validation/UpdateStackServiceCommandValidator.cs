using FluentValidation;

namespace CloudCrafter.Core.Commands.Stacks.Service.Validation;

public class UpdateStackServiceCommandValidator
    : AbstractValidator<UpdateStackServiceCommand.Command>
{
    public UpdateStackServiceCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).When(x => !string.IsNullOrEmpty(x.Name));
    }
}
