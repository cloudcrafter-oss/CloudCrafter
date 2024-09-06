using AutoMapper;

namespace CloudCrafter.Domain.Domain.Stack;

public class StackServerDto
{
    public required string Name { get; init; }
    public required string IpAddress { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Server, StackServerDto>();
        }
    }
}
