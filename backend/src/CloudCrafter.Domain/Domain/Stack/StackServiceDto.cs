using AutoMapper;
using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stack;

public class StackServiceDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string? Description { get; init; }

    public required StackServiceHttpConfigurationDto? HttpConfiguration { get; init; }
    public required EntityHealthDto Health { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<StackService, StackServiceDto>()
                .ForMember(x => x.Health, opt => opt.MapFrom(src => src.HealthStatus));
        }
    }
}

public class StackServiceHttpConfigurationDto
{
    public required string? DomainName { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<EntityHttpConfiguration, StackServiceHttpConfigurationDto>();
        }
    }
}
