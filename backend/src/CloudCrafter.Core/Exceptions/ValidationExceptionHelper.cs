namespace CloudCrafter.Core.Exceptions;

public abstract class ValidationExceptionHelper
{
    public static ValidationError ServerHasExistingResources()
    {
        return new ValidationError("server", "Server has existing resources");
    }
}
