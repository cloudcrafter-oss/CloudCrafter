using System.Text.Json.Serialization;
using AutoMapper;

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
    public required ProjectHealthStatus HealthStatus { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Stack, DeployedStackDto>()
                .ForMember(x => x.StackId, x => x.MapFrom(opt => opt.Id))
                .ForMember(x => x.HealthStatus, opt => opt.MapFrom(dest => ProjectHealthStatus.Unknown));
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectHealthStatus
{
    Healthy,
    Degraded,
    Unhealthy,
    Unknown
}
