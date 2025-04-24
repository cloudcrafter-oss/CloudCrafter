using CloudCrafter.Domain.Entities;
using CloudCrafter.TestUtilities.DomainHelpers;

namespace CloudCrafter.FunctionalTests.Domain.Providers;

using static Testing;

public abstract class ProviderBaseTest : BaseTestFixture
{
    public async Task<SourceProvider> CreateGithubSourceProvider(Guid? teamId = null)
    {
        var provider = EntityFaker.GenerateGithubSourceProvider();

        provider.TeamId = teamId;

        await AddAsync(provider);

        return provider;
    }
}
