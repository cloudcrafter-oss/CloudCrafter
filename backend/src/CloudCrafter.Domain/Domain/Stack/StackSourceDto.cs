using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stack;

public sealed class StackSourceDto
{
    public required StackSourceDtoType Type { get; init; }

    public required GitApplicationSourceDto? Git { get; init; }
    public required GithubApplicationSourceDto? GithubApp { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ApplicationSource, StackSourceDto>();
        }
    }
}

public sealed class GitApplicationSourceDto
{
    public required string Repository { get; init; }

    public string? Path { get; init; }

    public string? Branch { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ApplicationSourceGit, GitApplicationSourceDto>();
        }
    }
}

public sealed class GithubApplicationSourceDto
{
    public required string RepositoryId { get; init; }
    public required string Branch { get; init; }

    /// <summary>
    ///     Should only be set, Repository Id is leading
    /// </summary>
    public required string Repository { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ApplicationSourceGithubApp, GithubApplicationSourceDto>();
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum StackSourceDtoType
{
    Git,
    GithubApp,
}
