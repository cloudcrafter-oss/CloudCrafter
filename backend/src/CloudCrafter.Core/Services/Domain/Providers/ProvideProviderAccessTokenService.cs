using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Strategy;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Providers;

public class ProvideProviderAccessTokenService(ISourceProviderProxy proxy)
    : IProvideProviderAccessToken
{
    public Task<string> GetProviderAccessTokenAsync(SourceProvider provider)
    {
        return proxy.GetCheckoutAccessTokenAsync(provider);
    }
}
