using CloudCrafter.Domain.Domain.Environments;

namespace CloudCrafter.Core.Interfaces.Domain.Environments;

public interface IEnvironmentService
{
    Task CreateDefaultEnvironmentForProject(Guid projectId);
    Task<EnvironmentDto?> GetEnvironment(Guid id);
}
