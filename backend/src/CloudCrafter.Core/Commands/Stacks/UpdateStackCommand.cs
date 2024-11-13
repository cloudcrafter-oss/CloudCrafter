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
        string? GitRepository = null
    // Add other updatable properties here
    ) : IRequest<StackDetailDto?>, IRequireStackAccess;

    public record Handler(IStacksService StackService, IGitService GitService)
        : IRequestHandler<Command, StackDetailDto?>
    {
        public async Task<StackDetailDto?> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            if (!string.IsNullOrEmpty(request.GitRepository))
            {
                var isValidGitRepo = await GitService.ValidateRepository(request.GitRepository);
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
