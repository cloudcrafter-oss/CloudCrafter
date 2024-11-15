using Octokit;

namespace CloudCrafter.Core.Services.Core.Providers;

public class GithubClientProvider : IGithubClientProvider
{
    public IGitHubClient GetClient()
    {
        var client = new GitHubClient(new ProductHeaderValue("CloudCrafter"));

        return client;
    }

    public IGitHubClient GetClientForToken(string jwtToken)
    {
        var client = new GitHubClient(new ProductHeaderValue("CloudCrafter"))
        {
            Credentials = new Credentials(jwtToken, AuthenticationType.Bearer),
        };

        return client;
    }
}
