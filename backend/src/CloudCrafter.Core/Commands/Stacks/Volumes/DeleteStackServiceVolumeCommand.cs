using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record DeleteStackServiceVolumeCommand(
    Guid StackId,
    Guid StackServiceId,
    Guid StackServiceVolumeId
) : IRequest;

public class DeleteStackServiceVolumeCommandHandler(
    IStackServiceVolumesService stackServiceVolumesService
) : IRequestHandler<DeleteStackServiceVolumeCommand>
{
    public async Task Handle(
        DeleteStackServiceVolumeCommand request,
        CancellationToken cancellationToken
    )
    {
        await stackServiceVolumesService.DeleteStackServiceVolume(
            request.StackId,
            request.StackServiceId,
            request.StackServiceVolumeId
        );
    }
}
