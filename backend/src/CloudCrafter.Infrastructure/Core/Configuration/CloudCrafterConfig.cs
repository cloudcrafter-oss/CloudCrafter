using System.ComponentModel.DataAnnotations;

namespace CloudCrafter.Infrastructure.Core.Configuration;

public class CloudCrafterConfig
{
    public const string KEY = "CloudCrafter";

    [Required]
    public string AppKey { get; init; } = null!;
}
