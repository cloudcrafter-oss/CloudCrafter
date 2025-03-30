using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;

public abstract class BaseStrategy
{
    public abstract Task<BaseRecipeGenerator> GenerateRecipeAsync(
        Stack stack,
        Deployment deployment,
        ISourceProviderHelper providerHelperProvider
    );
}

public interface ISourceProviderHelper
{
    Task<string> GetProviderAccessTokenAsync(SourceProvider provider);
    Task<GitSourceLocationDto> GetSourceLocation(SourceProvider provider, ApplicationSource source);
}

public class GitSourceLocationDto
{
    public required string FullPath { get; init; }
    public required string GitUrl { get; set; }
}
