using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Utils;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Utils;

public class GitService(ILogger<GitService> logger, ICommandExecutor executor) : IGitService
{
    public async Task<GitRepositoryCheckResultDto> ValidateRepository(string repository)
    {
        var isValid = await IsValidGitRepository(repository);

        var result = new GitRepositoryCheckResultDto { IsValid = isValid };

        return result;
    }

    private async Task<bool> IsValidGitRepository(string url)
    {
        try
        {
            var result = await executor.ExecuteAsync("git", ["ls-remote", url]);
            return result.ExitCode == 0;
        }
        catch (Exception ex)
        {
            // Handle other exceptions (e.g., network issues)
            logger.LogCritical(ex, "Git repository check went wrong");
            return false;
        }
    }
}
