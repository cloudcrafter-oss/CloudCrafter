namespace CloudCrafter.Domain.Domain.Project;

public class ProjectEnvironmentEnhancedDto
{
    public required DateTime EnvironmentCreatedAt { get; init; }
    public required int DeployedApplicationsCount { get; init; }
    public required DateTime? LastDeploymentAt { get; init; }
    public required string EnvironmentName { get; init; }
    public required string ProjectName { get; init; }
    
    public required List<DeployedApplicationDto> DeployedApplications { get; init; } = new();
    

}

public class DeployedApplicationDto
{
    public required Guid ApplicationId { get; init; }
    public required string Name { get; init; }
    public required ApplicationHealthStatus HealthStatus { get; init; }
    
}

public enum ApplicationHealthStatus
{
    Healthy,
    Degraded,
    Unhealthy
}
