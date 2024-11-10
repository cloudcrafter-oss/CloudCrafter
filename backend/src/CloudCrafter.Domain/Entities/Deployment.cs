using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Deployment : BaseAuditableEntity
{
    public Stack? Stack { get; set; } = null!;
    public required Guid StackId { get; init; }
    public required List<DeploymentLog> Logs { get; init; }

    public required DeploymentState State { get; set; }
    public required string? RecipeYaml { get; set; }
}

public enum DeploymentState
{
    Created,
    Running,
    Failed,
    Succeeded,
}
