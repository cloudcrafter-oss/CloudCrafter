using CloudCrafter.Core.Exceptions;

namespace CloudCrafter.Core.Commands.Stacks;

public static class StackValidations
{
    public static ValidationError StackNotFound => new("Stack", "Stack not found");

    public static ValidationException Create(ValidationError error)
    {
        return new ValidationException(error);
    }
}
