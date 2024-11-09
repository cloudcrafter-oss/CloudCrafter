using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class UpdateStackCommand
{
    public record Command(
        Guid StackId,
        string? Name = null,
        string? Description = null
    // Add other updatable properties here
    ) : IRequest<StackDetailDto?>;

    public record Handler(IStacksService stackService) : IRequestHandler<Command, StackDetailDto?>
    {
        public async Task<StackDetailDto?> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var stack = await stackService.UpdateStack(request);

            return stack;
        }
    }
}
