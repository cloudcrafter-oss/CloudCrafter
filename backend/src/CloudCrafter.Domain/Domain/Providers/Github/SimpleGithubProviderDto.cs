using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Providers.Github;

public class SimpleGithubProviderDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required bool? IsConnected { get; init; }

    public required DateTime CreatedAt { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<GithubProvider, SimpleGithubProviderDto>()
                .ForMember(x => x.IsConnected, opt => opt.MapFrom(dest => dest.IsValid));
        }
    }
}
