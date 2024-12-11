using System.ComponentModel.DataAnnotations;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
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
    }

    private class Handler : IRequestHandler<Command, StackCreatedDto>
    {
        public Task<StackCreatedDto> Handle(Command request, CancellationToken cancellationToken)
        {
            // var args = new CreateStackArgsDto
            // {
            //     Name = request.Name,
            //     EnvironmentId = request.EnvironmentId,
            //     ServerId = request.ServerId,
            //     GitRepository = request.GitRepository,
            // };
            //
            // return await service.CreateStack(args);

            return Task.FromResult(new StackCreatedDto { Id = Guid.NewGuid() });
        }
    }
}
