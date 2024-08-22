using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Infrastructure.Core.Configuration;

public static class ConfigurationValidationExtensions
{
    public static void ValidateConfiguration<T>(this IServiceCollection services) where T : class
    {
        using var serviceProvider = services.BuildServiceProvider();
        var options = serviceProvider.GetService<IOptions<T>>();
        if (options == null)
        {
            throw new InvalidOperationException($"Configuration of type {typeof(T).Name} is not registered.");
        }

        var validationResults = new List<ValidationResult>();
        if (!Validator.TryValidateObject(options.Value, new ValidationContext(options.Value), validationResults, true))
        {
            var errors = validationResults.Select(r => r.ErrorMessage);
            throw new Exception($"Invalid configuration: {string.Join(", ", errors)}");
        }
    }
}
