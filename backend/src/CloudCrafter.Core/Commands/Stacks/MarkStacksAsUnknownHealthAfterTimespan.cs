using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public record MarkStacksAsUnknownHealthAfterTimespanCommand : IRequest;

public class MarkStacksAsUnknownHealthAfterTimespanCommandHandler(IStacksService stacksService)
    : IRequestHandler<MarkStacksAsUnknownHealthAfterTimespanCommand>
{
    public Task Handle(
        MarkStacksAsUnknownHealthAfterTimespanCommand request,
        CancellationToken cancellationToken
    )
    {
        return stacksService.MarkStacksUnknownAfterTimespan(TimeSpan.FromMinutes(5));
    }
}
