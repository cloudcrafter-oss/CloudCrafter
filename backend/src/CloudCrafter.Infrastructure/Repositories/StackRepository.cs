using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Domain.Application.Services;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class StackRepository(IApplicationDbContext context) : IStackRepository
{
    public async Task<Stack> CreateStack(CreateStackArgsDto args)
    {
        if (string.IsNullOrWhiteSpace(args.GitRepository))
        {
            throw new ArgumentOutOfRangeException("Not supported yet");
        }

        var stack = new Stack
        {
            Id = Guid.NewGuid(),
            Name = args.Name,
            EnvironmentId = args.EnvironmentId,
            ServerId = args.ServerId,
            // TODO: Handle source different
            Source = new ApplicationSource
            {
                Type = ApplicationSourceType.Git,
                Git = new ApplicationSourceGit { Repository = args.GitRepository },
            },
            // TODO: Allow multiple options
            BuildPack = StackBuildPack.Nixpacks,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.Stacks.Add(stack);

        stack.AddDomainEvent(DomainEventDispatchTiming.AfterSaving, new StackCreatedEvent(stack));

        await context.SaveChangesAsync();

        var stackFromDb = await GetStackInternal(stack.Id);

        return stackFromDb!;
    }

    public async Task<Stack?> GetStack(Guid id)
    {
        var stack = await GetStackInternal(id, false);

        return stack;
    }

    public async Task AddAppServiceToStack(Guid stackId, string name)
    {
        var stackService = new StackService
        {
            Id = Guid.NewGuid(),
            Name = name,
            StackServiceTypeId = StackServiceTypeConstants.App,
            StackId = stackId,
            HealthStatus = new(),
            // TODO: Based on the StackServiceType, we should add HttpConfiguration
            // E.g. databases should not get this.
            HttpConfiguration = null,
            HealthcheckConfiguration = new(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.StackServices.Add(stackService);

        await context.SaveChangesAsync();
    }

    public async Task<Guid> CreateDeployment(Guid stackId)
    {
        var deployment = new Deployment()
        {
            Id = Guid.NewGuid(),
            StackId = stackId,
            Logs = new(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.Deployments.Add(deployment);
        await context.SaveChangesAsync();

        return deployment.Id;
    }

    public Task<List<Deployment>> GetDeployments(Guid stackId)
    {
        return context
            .Deployments.Where(x => x.StackId == stackId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    private async Task<Stack?> GetStackInternal(Guid id, bool throwExceptionOnNotFound = true)
    {
        var stack = await context
            .Stacks.Include(x => x.Services)
            .Include(x => x.Server)
            .Include(x => x.Environment)
            .ThenInclude(x => x!.Project)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (stack is null && throwExceptionOnNotFound)
        {
            throw new ArgumentNullException("Stack not found");
        }

        return stack;
    }
}
