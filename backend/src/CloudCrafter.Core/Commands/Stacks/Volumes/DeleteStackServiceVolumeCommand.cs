using CloudCrafter.Core.Common.Security;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record DeleteStackServiceVolumeCommand(
    Guid StackId,
    Guid StackServiceId,
    Guid StackServiceVolumeId
) : IRequest;
