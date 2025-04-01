using Ardalis.GuardClauses;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackServiceVolumesService(IStackRepository repository) : IStackServiceVolumesService
{
    public async Task<Guid> CreateOrUpdateStackServiceVolume(
        Guid stackId,
        Guid stackServiceId,
        Guid? stackSourceVolumeId,
        string requestName,
        StackServiceVolumeType requestType,
        string? requestSource,
        string requestTarget
    )
    {
        var stackServiceExists = await repository.StackServiceExists(stackId, stackServiceId);

        if (!stackServiceExists)
        {
            throw new NotFoundException("StackService", "Stack service not found");
        }
        // Check if volume exists directly using volumeId if provided
        StackServiceVolume? existingVolume = null;

        if (stackSourceVolumeId.HasValue)
        {
            existingVolume = await repository.GetServiceVolume(
                stackId,
                stackServiceId,
                stackSourceVolumeId.Value
            );

            if (existingVolume == null)
            {
                throw new NotFoundException("StackServiceVolume", "Volume not found");
            }
        }

        if (!stackSourceVolumeId.HasValue)
        {
            existingVolume = new StackServiceVolume
            {
                Id = Guid.NewGuid(),
                StackServiceId = stackServiceId,
                Name = requestName,
                Type = requestType,
                SourcePath = requestSource,
                DestinationPath = requestTarget,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            repository.AddStackServiceVolume(existingVolume);
        }

        if (existingVolume == null)
        {
            throw new Exception(
                "Volume not found - this should not happen because we either fetch or create."
            );
        }

        // Update existing volume
        existingVolume.Name = requestName;
        existingVolume.Type = requestType;
        existingVolume.SourcePath = requestSource;
        existingVolume.DestinationPath = requestTarget;

        await repository.SaveChangesAsync();
        return existingVolume.Id;
    }

    public async Task<StackServiceVolume> GetServiceVolume(
        Guid stackId,
        Guid serviceId,
        Guid volumeId
    )
    {
        var volume = await repository.GetServiceVolume(stackId, serviceId, volumeId);

        if (volume == null)
        {
            throw new NotFoundException("StackServiceVolume", "Volume not found");
        }

        return volume;
    }
}
