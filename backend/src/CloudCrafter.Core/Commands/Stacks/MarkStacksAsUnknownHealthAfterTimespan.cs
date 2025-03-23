using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks;

public record MarkStacksAsUnknownHealthAfterTimespanCommand() : IRequest;

public class MarkStacksAsUnknownHealthAfterTimespanCommandHandler
    : IRequestHandler<MarkStacksAsUnknownHealthAfterTimespanCommand>
{
    private readonly IStacksService _stacksService;

    public MarkStacksAsUnknownHealthAfterTimespanCommandHandler(IStacksService stacksService)
    {
        _stacksService = stacksService;
    }

    public Task Handle(
        MarkStacksAsUnknownHealthAfterTimespanCommand request,
        CancellationToken cancellationToken
    )
    {
        return _stacksService.MarkStacksUnknownAfterTimespan(TimeSpan.FromMinutes(5));
    }
}
