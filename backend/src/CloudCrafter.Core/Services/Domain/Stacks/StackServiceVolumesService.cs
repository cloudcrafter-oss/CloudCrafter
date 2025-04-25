using Ardalis.GuardClauses;
using AutoMapper;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Domain.User.ACL;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackServiceVolumesService(
    IStackRepository repository,
    IMapper mapper,
    IUserAccessService userAccessService,
    IUser user
) : IStackServiceVolumesService
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
        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw new NotFoundException("Stack", "Stack not found");
        }

        await userAccessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Write
        );

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

    public async Task<List<StackServiceVolumeDto>> GetVolumes(Guid stackId, Guid stackServiceId)
    {
        var stackServiceExists = await repository.StackServiceExists(stackId, stackServiceId);

        if (!stackServiceExists)
        {
            throw new NotFoundException("StackService", "Stack service not found");
        }

        var volumes = await repository.GetServiceVolumes(stackId, stackServiceId);

        return mapper.Map<List<StackServiceVolumeDto>>(volumes);
    }

    public async Task DeleteStackServiceVolume(
        Guid stackId,
        Guid stackServiceId,
        Guid stackServiceVolumeId
    )
    {
        var notFoundException = new NotFoundException("StackService", "Stack service not found");

        var stack = await repository.GetStack(stackId);

        if (stack == null)
        {
            throw notFoundException;
        }

        await userAccessService.EnsureHasAccessToEntity(
            stack.Environment.Project,
            user?.Id,
            AccessType.Write
        );

        var stackServiceExists = await repository.StackServiceExists(stackId, stackServiceId);

        if (!stackServiceExists)
        {
            throw notFoundException;
        }

        var volume = await repository.GetServiceVolume(
            stackId,
            stackServiceId,
            stackServiceVolumeId
        );

        if (volume == null)
        {
            throw new NotFoundException("StackServiceVolume", "Volume not found");
        }

        repository.DeleteStackServiceVolume(volume);
        await repository.SaveChangesAsync();
    }
}
