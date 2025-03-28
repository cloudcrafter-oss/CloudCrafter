using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Providers;

public class SourceProviderHelperService(ISourceProviderProxy proxy) : ISourceProviderHelper
{
    public Task<string> GetProviderAccessTokenAsync(SourceProvider provider)
    {
        return proxy.GetCheckoutAccessTokenAsync(provider);
    }

    public Task<GitSourceLocationDto> GetSourceLocation(
        SourceProvider provider,
        ApplicationSource source
    )
    {
        return proxy.GetSourceLocation(provider, source);
    }
}
