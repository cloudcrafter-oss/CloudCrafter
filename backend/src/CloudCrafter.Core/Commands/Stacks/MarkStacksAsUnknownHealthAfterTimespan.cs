using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public static class MarkStacksAsUnknownHealthAfterTimespan
{
    public record Command() : IRequest;

    public class Handler(IStacksService stacksService) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return stacksService.MarkStacksUnknownAfterTimespan(TimeSpan.FromMinutes(5));
        }
    }
}
