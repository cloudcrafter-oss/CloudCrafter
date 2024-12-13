using System.ComponentModel.DataAnnotations;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class CreateStackCommand
{
    [Authorize]
    public class Command
        : IRequest<StackCreatedDto>,
            IRequireServerAccess,
            IRequireEnvironmentAccess
    {
        [MinLength(3)]
        public required string Name { get; init; }

        [MinLength(1)]
        public required string GitRepository { get; init; }

        public required Guid EnvironmentId { get; set; }

        public required Guid ServerId { get; set; }
    }

    private class Handler(IStacksService service) : IRequestHandler<Command, StackCreatedDto>
    {
        public async Task<StackCreatedDto> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var args = new CreateStackArgsDto
            {
                Name = request.Name,
                EnvironmentId = request.EnvironmentId,
                ServerId = request.ServerId,
                PublicGit = new CreateStackPublicGitRepo { GitRepository = request.GitRepository },
            };

            return await service.CreateStack(args);
        }
    }
}
