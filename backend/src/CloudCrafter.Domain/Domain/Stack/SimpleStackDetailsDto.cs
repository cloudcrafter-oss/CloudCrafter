using AutoMapper;

namespace CloudCrafter.Domain.Domain.Stack;

public class SimpleStackDetailsDto
{
    public required Guid Id { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Stack, SimpleStackDetailsDto>();
        }
    }
}
