using AutoMapper;

namespace CloudCrafter.Domain.Domain.Stack;

public class StackDetailDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }

    public List<StackServiceDto> Services { get; init; } = new();

    public required StackSourceDto? Source { get; init; }
    public required StackServerDto Destination { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Stack, StackDetailDto>()
                .ForMember(x => x.Destination, opt => opt.MapFrom(src => src.Server));
        }
    }
}
