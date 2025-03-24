using AutoMapper;
using CloudCrafter.Domain.Domain.Stacks;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Common.AutoMapper;

/// <summary>
/// AutoMapper value resolver that masks secret environment variable values
/// when includeSecrets is false
/// </summary>
public class SecretValueResolver
    : IValueResolver<StackEnvironmentVariable, StackEnvironmentVariableDto, string>
{
    private const string HIDDEN_VALUE = "[MASKED]";

    public string Resolve(
        StackEnvironmentVariable source,
        StackEnvironmentVariableDto destination,
        string destMember,
        ResolutionContext context
    )
    {
        bool includeSecrets =
            context.Items.TryGetValue("IncludeSecrets", out object? value) && value is bool b && b;

        if (source.IsSecret && !includeSecrets)
        {
            return HIDDEN_VALUE;
        }

        return source.Value;
    }
}
