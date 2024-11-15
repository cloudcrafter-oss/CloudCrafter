using Octokit;

namespace CloudCrafter.Core.Services.Core.Providers;

public interface IGithubClientProvider
{
    IGitHubClient GetClient();
    IGitHubClient GetClientForToken(string jwtToken);
}
