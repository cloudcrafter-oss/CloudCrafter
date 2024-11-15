using CloudCrafter.Domain.Domain.Providers.Github;

namespace CloudCrafter.Domain.Domain.Providers;

public class ProviderOverviewDto
{
    public required List<SimpleGithubProviderDto> Github { get; init; }
}
