using CloudCrafter.Core.Common.Security;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record CreateStackServiceVolumeCommand : IRequest<Guid>
{
    public Guid StackId { get; set; }
    public Guid StackServiceId { get; set; }
    public required string Name { get; init; }
    public required StackServiceVolumeType Type { get; init; }
    public required string? Source { get; init; }
    public required string Target { get; init; }
}
