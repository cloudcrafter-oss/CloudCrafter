using CloudCrafter.Core.Common.Security;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record UpdateStackServiceVolumeCommand : CreateStackServiceVolumeCommand
{
    public Guid Id { get; set; }
}
