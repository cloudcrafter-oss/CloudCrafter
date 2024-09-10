using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class Stack : BaseAuditableEntity
{
    public required string Name { get; init; }
    public Environment? Environment { get; set; }
    public required Guid EnvironmentId { get; set; }
    public Server? Server { get; set; }
    public required Guid ServerId { get; set; }

    public required StackBuildPack BuildPack { get; init; }
    public ApplicationSource? Source { get; set; }

    public List<Deployment> Deployments { get; set; } = new();
    public List<StackService> Services { get; set; } = new();
}

public enum StackBuildPack
{
    Nixpacks,
}
