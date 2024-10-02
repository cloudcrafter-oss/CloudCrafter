using System.ComponentModel.DataAnnotations;

namespace CloudCrafter.Agent.Models.Configs;

public class AgentConfig
{
    public const string KEY = "Agent";

    [Required]
    public required Guid ServerId { get; init; }

    [Required]
    public required string AgentKey { get; init; }

    [Required]
    public required string CloudCrafterHost { get; init; }
}
