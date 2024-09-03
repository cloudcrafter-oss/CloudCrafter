using AutoMapper;
using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.Domain.Domain.Environments;

public class EnvironmentDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Environment, EnvironmentDto>();
        }
    }
}
