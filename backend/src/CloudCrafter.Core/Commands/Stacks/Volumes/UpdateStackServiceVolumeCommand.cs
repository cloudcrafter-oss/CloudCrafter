using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record UpdateStackServiceVolumeCommand : CreateStackServiceVolumeCommand
{
    public Guid Id { get; set; }
}

public class UpdateStackServiceVolumeCommandHandler(
    IStackServiceVolumesService stackServiceVolumesService
) : IRequestHandler<UpdateStackServiceVolumeCommand, Guid>
{
    public async Task<Guid> Handle(
        UpdateStackServiceVolumeCommand request,
        CancellationToken cancellationToken
    )
    {
        var id = await stackServiceVolumesService.CreateOrUpdateStackServiceVolume(
            request.StackId,
            request.StackServiceId,
            request.Id,
            request.Name,
            request.Type,
            request.Source,
            request.Target
        );

        return id;
    }
}
