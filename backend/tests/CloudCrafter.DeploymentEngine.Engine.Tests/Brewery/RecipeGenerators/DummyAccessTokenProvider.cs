using CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.RecipeGenerators;

public class DummyHelperProvider : ISourceProviderHelper
{
    public Task<string> GetProviderAccessTokenAsync(SourceProvider provider)
    {
        return Task.FromResult("dummy");
    }

    public Task<GitSourceLocationDto> GetSourceLocation(
        SourceProvider provider,
        ApplicationSource source
    )
    {
        return Task.FromResult(
            new GitSourceLocationDto
            {
                FullPath = "cloudcrafter-oss/ci-private-tests",
                GitUrl = "git://github.com/cloudcrafter-oss/ci-private-tests.git",
            }
        );
    }
}
