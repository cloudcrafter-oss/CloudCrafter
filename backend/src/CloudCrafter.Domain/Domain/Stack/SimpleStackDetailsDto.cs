using AutoMapper;

namespace CloudCrafter.Domain.Domain.Stack;

public class SimpleStackDetailsDto
{
    public required Guid Id { get; init; }

    private class Mapping : Profile
    {
        private Mapping()
        {
            CreateMap<Entities.Stack, SimpleStackDetailsDto>();
        }
    }
}
