using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IEnvironmentRepository
{
    Task CreateEnvironment(string name, Guid projectId);
    Task<Environment?> GetEnvironment(Guid environmentId, Guid projectId);
    Task<Environment?> GetEnvironment(Guid environmentId);
}
