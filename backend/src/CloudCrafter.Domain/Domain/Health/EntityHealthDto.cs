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

public enum EntityHealthDtoValue
{
    Unknown,
    Unsupported,
    Degraded,
    Unhealthy,
    Healthy
}
