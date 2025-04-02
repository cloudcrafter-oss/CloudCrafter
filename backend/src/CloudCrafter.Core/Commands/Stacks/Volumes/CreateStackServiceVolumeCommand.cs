using System.ComponentModel.DataAnnotations;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record CreateStackServiceVolumeCommand : IRequest<Guid>
{
    public Guid StackId { get; set; }
    public Guid StackServiceId { get; set; }

    [Required]
    [MinLength(1)]
    public required string Name { get; init; }

    [Required]
    public required StackServiceVolumeType Type { get; init; }
    public required string? Source { get; init; }

    [Required]
    [MinLength(1)]
    public required string Target { get; init; }
}

public class CreateStackServiceVolumeCommandHandler(
    IStackServiceVolumesService stackServiceVolumesService
) : IRequestHandler<CreateStackServiceVolumeCommand, Guid>
{
    public async Task<Guid> Handle(
        CreateStackServiceVolumeCommand request,
        CancellationToken cancellationToken
    )
    {
        var id = await stackServiceVolumesService.CreateOrUpdateStackServiceVolume(
            request.StackId,
            request.StackServiceId,
            null,
            request.Name,
            request.Type,
            request.Source,
            request.Target
        );

        return id;
    }
}
