using CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.RecipeGenerators;

public class DummyAccessTokenProvider : IProvideProviderAccessToken
{
    public Task<string> GetProviderAccessTokenAsync(SourceProvider provider)
    {
        return Task.FromResult("dummy");
    }
}
