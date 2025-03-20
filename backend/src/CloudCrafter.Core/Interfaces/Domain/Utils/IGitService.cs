using CloudCrafter.Domain.Domain.Utils;

namespace CloudCrafter.Core.Interfaces.Domain.Utils;

public interface IGitService
{
    Task<GitRepositoryCheckResultDto> ValidateRepository(
        string repository,
        string? path = null,
        string? branch = null
    );

    Task<GitRepositoryCheckResultDto> ValidateSourceProviderBranch(Guid stackId, string branchName);
}
