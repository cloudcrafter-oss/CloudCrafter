namespace CloudCrafter.Domain.Entities;

public class ApplicationSource
{
    public required ApplicationSourceType Type { get; init; }

    // When Type == Type.Git
    public ApplicationSourceGit? Git { get; set; }

    public ApplicationSourceGithubApp? GithubApp { get; set; }
}

public class ApplicationSourceGit
{
    public required string Repository { get; set; }

    /// <summary>
    ///     Path in the Git repository where the stack is located.
    /// </summary>
    public string? Path { get; set; }

    public string? Branch { get; set; }
}

public class ApplicationSourceGithubApp
{
    public required Guid SourceProviderId { get; set; }
    public SourceProvider SourceProvider { get; set; } = null!;

    public required string RepositoryId { get; set; }
    public required string Branch { get; set; }

    /// <summary>
    ///     Should only be set, Repository Id is leading
    /// </summary>
    public required string Repository { get; set; }
}

public enum ApplicationSourceType
{
    Git,
    GithubApp,
}
