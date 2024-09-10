using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CloudCrafter.Infrastructure.Core.Configuration.Attributes;

public class ValidJwtSecretKeyAttribute : ValidationAttribute
{
    private const int MinimumKeyLength = 32; // 256 bits

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return new ValidationResult("The JWT secret key cannot be null.");
        }

        string? secretKey = value.ToString();

        if (string.IsNullOrWhiteSpace(secretKey))
        {
            return new ValidationResult("The JWT secret key cannot be empty or whitespace.");
        }

        if (Encoding.UTF8.GetByteCount(secretKey) < MinimumKeyLength)
        {
            return new ValidationResult(
                $"The JWT secret key should be at least {MinimumKeyLength} bytes long when encoded in UTF-8."
            );
        }

        return ValidationResult.Success;
    }
}
