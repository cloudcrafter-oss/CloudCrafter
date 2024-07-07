using AutoMapper;

namespace CloudCrafter.Domain.Domain.Server;

public class ServerDetailDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string IpAddress { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Server, ServerDetailDto>();
        }
    }
}
