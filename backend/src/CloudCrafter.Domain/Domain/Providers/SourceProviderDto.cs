using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Domain.Providers.Github;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Providers;

public class SourceProviderDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public SimpleGithubProviderDto? Github { get; init; }

    public ProviderType Type
    {
        get
        {
            if (Github != null)
            {
                return ProviderType.Github;
            }

            return ProviderType.Unknown;
        }
    }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<SourceProvider, SourceProviderDto>()
                .ForMember(x => x.Github, opt => opt.MapFrom(src => src.GithubProvider));
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProviderType
{
    Unknown,
    Github,
}
