using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IDeploymentRepository
{
    Task<Deployment> GetDeploymentAsync(Guid id);

    Task SaveChangesAsync();
}
