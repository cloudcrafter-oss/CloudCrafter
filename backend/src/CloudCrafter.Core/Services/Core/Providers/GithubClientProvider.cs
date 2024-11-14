using Octokit;

namespace CloudCrafter.Core.Services.Core.Providers;

public class GithubClientProvider : IGithubClientProvider
{
    public IGitHubClient GetClient()
    {
        var client = new GitHubClient(new ProductHeaderValue("CloudCrafter"));

        return client;
    }
}
