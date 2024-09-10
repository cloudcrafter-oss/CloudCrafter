using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.Infrastructure.Repositories;

public class EnvironmentRepository(IApplicationDbContext context) : IEnvironmentRepository
{
    private IQueryable<Environment> Environments =>
        context
            .Environments.Include(x => x.Project)
            .Include(x => x.Stacks)
            .OrderBy(x => x.CreatedAt);

    public Task CreateEnvironment(string name, Guid projectId)
    {
        var environment = new Environment
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ProjectId = projectId,
        };

        context.Environments.Add(environment);

        return context.SaveChangesAsync();
    }

    public Task<Environment?> GetEnvironment(Guid environmentId, Guid projectId)
    {
        return Environments
            .Where(x => x.Id == environmentId && x.ProjectId == projectId)
            .FirstOrDefaultAsync();
    }

    public Task<Environment?> GetEnvironment(Guid environmentId)
    {
        return Environments.FirstOrDefaultAsync(x => x.Id == environmentId);
    }
}
