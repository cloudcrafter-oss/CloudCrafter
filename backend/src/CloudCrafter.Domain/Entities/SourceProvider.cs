using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Entities.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class SourceProvider : BaseEntity, IMayHaveATeam
{
    public required string Name { get; set; }
    public required Guid? TeamId { get; set; }
    public Team? Team { get; set; }

    public GithubProvider? GithubProvider { get; set; }
    public Guid? GithubProviderId { get; set; }
}
