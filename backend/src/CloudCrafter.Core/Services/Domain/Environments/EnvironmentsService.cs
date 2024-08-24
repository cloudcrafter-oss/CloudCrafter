using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Repositories;

namespace CloudCrafter.Core.Services.Domain.Environments;

public class EnvironmentsService(IEnvironmentRepository repository) : IEnvironmentService
{
    public Task CreateDefaultEnvironmentForProject(Guid projectId)
    {
        return repository.CreateEnvironment("Production", projectId);
    }
}
