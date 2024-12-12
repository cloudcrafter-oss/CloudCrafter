using System.ComponentModel.DataAnnotations;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Providers;

public static class CreateStackFromSourceProviderCommand
{
    [Authorize]
    public class Command
        : IRequest<StackCreatedDto>,
            IRequireServerAccess,
            IRequireEnvironmentAccess
    {
        [MinLength(3)]
        public required string Name { get; init; }

        public required Guid ProviderId { get; init; }

        [MinLength(1)]
        public required string RepositoryId { get; init; }

        [MinLength(1)]
        public required string Branch { get; init; }

        public required Guid EnvironmentId { get; set; }

        public required Guid ServerId { get; set; }

        /// <summary>
        /// Only cosmetic, RepositoryId is leading
        /// </summary>
        public required string Repository { get; set; }
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
                GithubApp = new CreateStackGithubAppDto
                {
                    RepositoryId = request.RepositoryId,
                    Branch = request.Branch,
                    ProviderId = request.ProviderId,
                    Repository = request.Repository,
                },
            };

            return await service.CreateStack(args);
        }
    }
}
