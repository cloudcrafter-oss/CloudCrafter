using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Environments;

namespace CloudCrafter.Core.Services.Domain.Environments;

public class EnvironmentsService(IEnvironmentRepository repository, IMapper mapper) : IEnvironmentService
{
    public Task CreateDefaultEnvironmentForProject(Guid projectId)
    {
        return repository.CreateEnvironment("Production", projectId);
    }

    public async Task<EnvironmentDto?> GetEnvironment(Guid id)
    {
       var environment = await repository.GetEnvironment(id);

       if (environment == null)
       {
           return null;
       }
       
       return mapper.Map<EnvironmentDto>(environment);
    }
}
