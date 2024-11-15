using GitHubJwt;

namespace CloudCrafter.Core.Services.Domain.Providers.Github;

public class CloudCrafterStringPrivateKeySource(string Key) : IPrivateKeySource
{
    public TextReader GetPrivateKeyReader()
    {
        return new StringReader(Key);
    }
}
