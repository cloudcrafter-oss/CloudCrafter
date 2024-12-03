using FluentValidation.Results;

namespace CloudCrafter.Core.Exceptions;

public class ValidationException : Exception
{
    public ValidationException()
        : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }

    public ValidationException(string key, string message)
        : this()
    {
        Errors = new Dictionary<string, string[]> { { key, new[] { message } } };
    }

    public ValidationException(ValidationError error)
        : this()
    {
        Errors = new Dictionary<string, string[]> { { error.Key, new[] { error.Message } } };
    }

    public IDictionary<string, string[]> Errors { get; }
}

public record ValidationError(string Key, string Message);
