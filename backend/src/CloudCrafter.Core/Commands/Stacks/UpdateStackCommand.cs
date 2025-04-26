using System.ComponentModel;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

[Authorize]
public record UpdateStackCommand(
    Guid StackId,
    string? Name = null,
    string? Description = null,
    UpdateStackGitPublicSettings? GitPublicSettings = null,
    UpdateStackGithubSettings? GithubSettings = null
// Add other updatable properties here
) : IRequest<StackDetailDto?>, IRequireStackAccess;

[DefaultValue(null)]
public class UpdateStackGitPublicSettings
{
    public string? Repository { get; set; }
    public string? Path { get; set; }
    public string? Branch { get; set; }
}

[DefaultValue(null)]
public class UpdateStackGithubSettings
{
    public string? Branch { get; set; }
    public string? Path { get; set; }
}

internal class UpdateStackCommandHandler(IStacksService stackService, IGitService gitService)
    : IRequestHandler<UpdateStackCommand, StackDetailDto?>
{
    public async Task<StackDetailDto?> Handle(
        UpdateStackCommand request,
        CancellationToken cancellationToken
    )
    {
        await stackService.EnsureStackWritePermissions(request.StackId);

        if (!string.IsNullOrEmpty(request.GitPublicSettings?.Repository))
        {
            var isValidGitRepo = await gitService.ValidateRepository(
                request.GitPublicSettings.Repository,
                request.GitPublicSettings.Path,
                request.GitPublicSettings.Branch
            );

            if (!isValidGitRepo.IsValid)
            {
                throw new ValidationException("GitRepository", "Invalid Git repository");
            }
        }

        if (!string.IsNullOrWhiteSpace(request.GithubSettings?.Branch))
        {
            var isValidGitBranch = await gitService.ValidateSourceProviderBranch(
                request.StackId,
                request.GithubSettings.Branch
            );

            if (!isValidGitBranch.IsValid)
            {
                throw new ValidationException("Branch", "Invalid branch");
            }
        }

        var stack = await stackService.UpdateStack(request);

        return stack;
    }
}
