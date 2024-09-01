using CloudCrafter.Domain.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class Stack : IHasTimestamps
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public Environment? Environment { get; set; }
    public Guid EnvironmentId { get; set; }
    public required Server Server { get; set; }

    public ApplicationSource? Source { get; set; }

    public List<Deployment> Deployments { get; set; } = new();
    public List<ApplicationService> Services { get; set; } = new();
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }
}
