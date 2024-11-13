namespace CloudCrafter.Domain.Entities;

public class ApplicationSource
{
    public required ApplicationSourceType Type { get; init; }

    // When Type == Type.Git
    public ApplicationSourceGit? Git { get; set; }
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

public enum ApplicationSourceType
{
    Git,
    GitSsh,
}
