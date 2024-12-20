using System.ComponentModel;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class UpdateStackCommand
{
    [Authorize]
    public record Command(
        Guid StackId,
        string? Name = null,
        string? Description = null,
        GitPublicSettings? GitPublicSettings = null,
        GithubSettings? GithubSettings = null
    // Add other updatable properties here
    ) : IRequest<StackDetailDto?>, IRequireStackAccess;

    [DefaultValue(null)]
    public class GitPublicSettings
    {
        public string? Repository { get; set; }
        public string? Path { get; set; }
        public string? Branch { get; set; }
    }

    [DefaultValue(null)]
    public class GithubSettings
    {
        public string? Branch { get; set; }
        public string? Path { get; set; }
    }

    public record Handler(IStacksService StackService, IGitService GitService)
        : IRequestHandler<Command, StackDetailDto?>
    {
        public async Task<StackDetailDto?> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            if (!string.IsNullOrEmpty(request.GitPublicSettings?.Repository))
            {
                var isValidGitRepo = await GitService.ValidateRepository(
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
                var isValidGitBranch = await GitService.ValidateSourceProviderBranch(
                    request.StackId,
                    request.GithubSettings.Branch
                );

                if (!isValidGitBranch.IsValid)
                {
                    throw new ValidationException("Branch", "Invalid branch");
                }
            }

            var stack = await StackService.UpdateStack(request);

            return stack;
        }
    }
}
