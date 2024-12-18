﻿using CloudCrafter.Core.Interfaces.Domain.Providers;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Utils;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Services.Domain.Utils;

public class GitService(
    ILogger<GitService> logger,
    ICommandExecutor executor,
    IStackRepository stackRepository,
    ISourceProviderProxy sourceProviderProxy
) : IGitService
{
    public async Task<GitRepositoryCheckResultDto> ValidateRepository(
        string repository,
        string? path = null,
        string? branch = null
    )
    {
        var isValid = await IsValidGitRepository(repository);

        if (string.IsNullOrEmpty(path) && string.IsNullOrEmpty(branch))
        {
            return new GitRepositoryCheckResultDto { IsValid = isValid };
        }

        var pathExists = await CheckoutAndCheckIfPathExists(repository, path, branch);

        return new GitRepositoryCheckResultDto { IsValid = isValid && pathExists };
    }

    public async Task<GitRepositoryCheckResultDto> ValidateSourceProviderBranch(
        Guid stackId,
        string branchName
    )
    {
        var stack = await stackRepository.GetStack(stackId);

        if (stack == null)
        {
            return new GitRepositoryCheckResultDto { IsValid = false };
        }

        if (stack.Source == null || stack.Source.GithubApp == null)
        {
            return new GitRepositoryCheckResultDto { IsValid = false };
        }

        var branches = await sourceProviderProxy.GetBranches(
            stack.Source.GithubApp.SourceProvider,
            stack.Source.GithubApp.RepositoryId
        );

        var hasBranch = branches.FirstOrDefault(x => x.Name == branchName) != null;

        return new GitRepositoryCheckResultDto { IsValid = hasBranch };
    }

    private async Task<bool> CheckoutAndCheckIfPathExists(
        string repository,
        string? path,
        string? branch
    )
    {
        var tempDir = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
        var exists = false;

        try
        {
            // Clone repository with depth 1 to get just latest commit
            var cloneArgs = new List<string> { "clone", "--depth", "1" };
            if (!string.IsNullOrEmpty(branch))
            {
                cloneArgs.AddRange(["-b", branch]);
            }

            cloneArgs.AddRange([repository, tempDir]);

            var cloneResult = await executor.ExecuteAsync("git", cloneArgs);
            if (cloneResult.ExitCode != 0)
            {
                return false;
            }

            // Check if specified path exists in cloned repo
            if (!string.IsNullOrEmpty(path))
            {
                var fullPath = Path.Combine(tempDir, path.TrimStart('/'));
                var dirExists = Directory.Exists(fullPath);

                return dirExists;
            }

            // if we came here, it does exists.
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking repository directory");
            exists = false;
        }
        finally
        {
            // Clean up temp directory
            if (Directory.Exists(tempDir))
            {
                try
                {
                    Directory.Delete(tempDir, true);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to clean up temporary directory");
                }
            }
        }

        return exists;
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
