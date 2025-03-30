using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Providers.Github;

public class SimpleGithubProviderDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required bool? IsConnected { get; init; }
    public required bool HasInstallation { get; init; }

    public required DateTime CreatedAt { get; init; }

    public required string? AppUrl { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<GithubProvider, SimpleGithubProviderDto>()
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.AppName))
                .ForMember(x => x.IsConnected, opt => opt.MapFrom(dest => dest.IsValid))
                .ForMember(
                    x => x.HasInstallation,
                    opt => opt.MapFrom(dest => dest.InstallationId.HasValue)
                );
        }
    }
}
