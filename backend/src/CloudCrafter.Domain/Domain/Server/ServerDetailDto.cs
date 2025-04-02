using AutoMapper;

namespace CloudCrafter.Domain.Domain.Server;

public class ServerDetailDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string IpAddress { get; set; }

    public string? AgentKey { get; set; }

    public string? DockerNetworkName { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Server, ServerDetailDto>()
                .ForMember(x => x.AgentKey, opt => opt.MapFrom(src => src.AgentSecretKey))
                .ForMember(x => x.DockerNetworkName, opt => opt.MapFrom(src => src.DockerNetwork));
        }
    }
}
