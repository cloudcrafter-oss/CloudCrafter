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
        GitSettings? GitSettings = null
    // Add other updatable properties here
    ) : IRequest<StackDetailDto?>, IRequireStackAccess;

    [DefaultValue(null)]
    public class GitSettings
    {
        public string? GitRepository { get; set; }
        public string? GitPath { get; set; }
        public string? GitBranch { get; set; }
    }

    public record Handler(IStacksService StackService, IGitService GitService)
        : IRequestHandler<Command, StackDetailDto?>
    {
        public async Task<StackDetailDto?> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            if (!string.IsNullOrEmpty(request.GitSettings?.GitRepository))
            {
                var isValidGitRepo = await GitService.ValidateRepository(
                    request.GitSettings.GitRepository,
                    request.GitSettings.GitPath,
                    request.GitSettings.GitBranch
                );

                if (!isValidGitRepo.IsValid)
                {
                    throw new ValidationException("GitRepository", "Invalid Git repository");
                }
            }

            var stack = await StackService.UpdateStack(request);

            return stack;
        }
    }
}
