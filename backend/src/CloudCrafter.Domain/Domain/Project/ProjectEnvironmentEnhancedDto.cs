namespace CloudCrafter.Domain.Domain.Project;

public class ProjectEnvironmentEnhancedDto
{
    public required DateTime EnvironmentCreatedAt { get; init; }
    public required int DeployedStackCount { get; init; }
    public required DateTime? LastDeploymentAt { get; init; }
    public required string EnvironmentName { get; init; }
    public required string ProjectName { get; init; }
    
    public required List<DeployedStackDto> DeployedStacks { get; init; } = new();
    

}

public class DeployedStackDto
{
    public required Guid StackId { get; init; }
    public required string Name { get; init; }
    public required StackHealthStatus HealthStatus { get; init; }
    
}

public enum StackHealthStatus
{
    Healthy,
    Degraded,
    Unhealthy
}
