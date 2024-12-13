using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class SourceProvider : BaseEntity
{
    public required string Name { get; set; }

    public GithubProvider? GithubProvider { get; set; }
    public Guid? GithubProviderId { get; set; }
}
