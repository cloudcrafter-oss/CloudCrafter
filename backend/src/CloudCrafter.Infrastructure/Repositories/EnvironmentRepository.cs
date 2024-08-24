using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.Infrastructure.Repositories;

public class EnvironmentRepository(IApplicationDbContext context) : IEnvironmentRepository
{
    public Task CreateEnvironment(string name, Guid projectId)
    {
        var environment = new Environment()
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ProjectId = projectId
        };

        context.Environments.Add(environment);

        return context.SaveChangesAsync();
    }
}
