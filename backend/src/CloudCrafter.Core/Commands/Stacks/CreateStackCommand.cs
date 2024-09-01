using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class CreateStackCommand
{
    [Authorize]
    public class Command : IRequest<StackCreatedDto>
    {
        public required string Name { get; init; }
        public required string GitRepository { get; init; }
    }
    
    private class Handler(IStacksService service) : IRequestHandler<Command, StackCreatedDto>
    {
        public async Task<StackCreatedDto> Handle(Command request, CancellationToken cancellationToken)
        {
            return await service.CreateStack(request.Name, request.GitRepository);
        }
    }
}
