using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Health;

public class EntityHealthDto
{
    public DateTime? StatusAt { get; init; }
    public EntityHealthDtoValue Value { get; init; } = EntityHealthDtoValue.Unknown;

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<EntityHealthStatus, EntityHealthDto>();
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EntityHealthDtoValue
{
    Unknown,
    Unsupported,
    Degraded,
    Unhealthy,
    Healthy,
}
