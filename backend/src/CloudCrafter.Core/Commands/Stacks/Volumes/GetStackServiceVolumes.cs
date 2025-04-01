using CloudCrafter.Core.Common.Security;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record GetStackServiceVolumesQuery(Guid StackId, Guid StackServiceId)
    : IRequest<List<StackServiceVolumeDto>>;
