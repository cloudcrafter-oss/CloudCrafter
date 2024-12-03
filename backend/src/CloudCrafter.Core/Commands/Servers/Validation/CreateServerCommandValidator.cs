using FluentValidation;

namespace CloudCrafter.Core.Commands.Servers.Validation;

public class CreateServerCommandValidator : AbstractValidator<CreateServerCommand.Command>
{
    public CreateServerCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3);
    }
}
