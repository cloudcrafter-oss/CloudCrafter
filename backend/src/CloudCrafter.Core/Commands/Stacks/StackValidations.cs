using CloudCrafter.Core.Exceptions;

namespace CloudCrafter.Core.Commands.Stacks;

public static class StackValidations
{
    public static ValidationError StackNotFound => new("Stack", "Stack not found");

    public static ValidationError EnvironmentVariableNotFound =>
        new("EnvironmentVariable", "Environment variable not found");

    public static ValidationError EnvironmentVariableGroupNotFound =>
        new(
            "EnvironmentVariableGroup",
            "Environment variable group is not found within this Stack"
        );

    public static ValidationError EnvironmentVariableNotUnique =>
        new("EnvironmentVariable", "Environment variable key must be unique");
    public static ValidationError EnvironmentVariableGroupNotUnique =>
        new(
            "EnvironmentVariableGroup",
            "Environment variable group name must be unique for this Stack"
        );

    public static ValidationException Create(ValidationError error)
    {
        return new ValidationException(error);
    }
}
