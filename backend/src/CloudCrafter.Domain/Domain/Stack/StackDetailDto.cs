using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Domain.Domain.Stack;

public class StackDetailDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    
    [NotMapped]
    public List<StackServiceDto> Services { get; init; } = new();

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Stack, StackDetailDto>();
        }
    }
}

public class StackServiceDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required ServiceHealthStatus HealthStatus { get; init; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ServiceHealthStatus
{
    Healthy,
    Degraded,
    Unhealthy,
    Unknown
}
