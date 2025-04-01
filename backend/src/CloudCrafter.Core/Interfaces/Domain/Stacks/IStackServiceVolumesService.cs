using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStackServiceVolumesService
{
    Task<Guid> CreateOrUpdateStackServiceVolume(
        Guid stackId,
        Guid stackServiceId,
        Guid? stackSourceVolumeId,
        string requestName,
        StackServiceVolumeType requestType,
        string? requestSource,
        string requestTarget
    );

    Task<List<StackServiceVolumeDto>> GetVolumes(Guid stackId, Guid stackServiceId);
}
