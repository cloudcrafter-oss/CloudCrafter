using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Volumes;

[Authorize]
public record GetStackServiceVolumesQuery(Guid StackId, Guid StackServiceId)
    : IRequest<List<StackServiceVolumeDto>>;

public class GetStackServiceVolumesQueryHandler(IStackServiceVolumesService service)
    : IRequestHandler<GetStackServiceVolumesQuery, List<StackServiceVolumeDto>>
{
    public Task<List<StackServiceVolumeDto>> Handle(
        GetStackServiceVolumesQuery request,
        CancellationToken cancellationToken
    )
    {
        return service.GetVolumes(request.StackId, request.StackServiceId);
    }
}
