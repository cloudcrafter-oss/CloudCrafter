using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class DeploymentRepository(IApplicationDbContext context) : IDeploymentRepository
{
    public async Task<Deployment> GetDeploymentAsync(Guid id)
    {
        var deployment = await context.Deployments.Where(x => x.Id == id).FirstOrDefaultAsync();

        if (deployment == null)
        {
            throw new Exception($"Deployment with id {id} not found");
        }

        return deployment;
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }

    public async Task MarkDeployment(Guid deploymentId, DeploymentState statusEntity)
    {
        var deployment = await context
            .Deployments.Where(x => x.Id == deploymentId)
            .FirstOrDefaultAsync();

        if (deployment == null)
        {
            return;
        }

        deployment.State = statusEntity;
        deployment.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
    }
}
