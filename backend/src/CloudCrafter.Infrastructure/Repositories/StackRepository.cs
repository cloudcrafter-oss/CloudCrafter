using AutoMapper;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Domain.Application.Services;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Domain.Stack.Filter;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;
using CloudCrafter.Domain.Requests.Filtering;
using CloudCrafter.Infrastructure.Common.Helpers;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class StackRepository(IApplicationDbContext context, IMapper mapper) : IStackRepository
{
    public async Task<Stack> CreateStack(CreateStackArgsDto args)
    {
        if (!args.IsGithubApp() && !args.IsPublicGitRepo())
        {
            throw new ArgumentOutOfRangeException("Provided configuration not supported");
        }

        ApplicationSource? source = null;

        if (args.IsPublicGitRepo())
        {
            source = new ApplicationSource
            {
                Type = ApplicationSourceType.Git,
                Git = new ApplicationSourceGit { Repository = args.PublicGit!.GitRepository },
            };
        }

        if (args.IsGithubApp())
        {
            source = new ApplicationSource
            {
                Type = ApplicationSourceType.GithubApp,
                GithubApp = new ApplicationSourceGithubApp
                {
                    Branch = args.GithubApp!.Branch,
                    RepositoryId = args.GithubApp!.RepositoryId,
                    SourceProviderId = args.GithubApp.ProviderId,
                    Repository = args.GithubApp.Repository,
                    Path = args.GithubApp.Path,
                },
            };
        }

        if (source == null)
        {
            throw new ArgumentOutOfRangeException("Provided configuration not supported");
        }

        var stack = new Stack
        {
            Id = Guid.NewGuid(),
            Name = args.Name,
            EnvironmentId = args.EnvironmentId,
            ServerId = args.ServerId,
            Description = null,
            Source = source,
            // TODO: Allow multiple options
            BuildPack = StackBuildPack.Nixpacks,
            HealthStatus = new StackHealthEntity
            {
                StatusAt = null,
                Value = EntityHealthStatusValue.Unknown,
            },
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
            Description = $"Auto generated by CloudCrafter at {DateTime.UtcNow}",
            StackServiceTypeId = StackServiceTypeConstants.App,
            StackId = stackId,
            HealthStatus = new EntityStackServiceHealthStatus(),
            // TODO: Based on the StackServiceType, we should add HttpConfiguration
            // E.g. databases should not get this.
            HttpConfiguration = null,
            HealthcheckConfiguration = new EntityHealthcheckConfiguration(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.StackServices.Add(stackService);

        await context.SaveChangesAsync();
    }

    public async Task<Guid> CreateDeployment(Guid stackId)
    {
        var stack = await GetStack(stackId);

        if (stack == null)
        {
            throw new ArgumentNullException("Stack not found");
        }

        var deployment = new Deployment
        {
            Id = Guid.NewGuid(),
            StackId = stackId,
            ServerId = stack.ServerId,
            Logs = new List<DeploymentLog>(),
            State = DeploymentState.Created,
            RecipeYaml = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        context.Deployments.Add(deployment);
        await context.SaveChangesAsync();

        return deployment.Id;
    }

    public Task<StackService?> GetService(Guid stackServiceId)
    {
        return context
            .StackServices.Where(x => x.Id == stackServiceId)
            .Include(x => x.Stack)
            .FirstOrDefaultAsync();
    }

    public Task<List<Deployment>> GetDeployments(DeploymentsFilter filter)
    {
        return GetDeploymentQuery(filter).ToListAsync();
    }

    public async Task<PaginatedList<SimpleDeploymentDto>> GetDeploymentsPaginated(
        DeploymentsFilter filter,
        BasePaginationRequest paginatedRequest
    )
    {
        var deployments = GetDeploymentQuery(filter);

        var result = await deployments.ToPaginatedListAsync<Deployment, SimpleDeploymentDto>(
            paginatedRequest,
            mapper
        );

        return result;
    }

    public async Task<List<Stack>> FilterStacks(StackFilter filter)
    {
        IQueryable<Stack> stacks = context.Stacks.Include(x => x.Services);

        if (filter.HealthCheckAgeOlderThan.HasValue)
        {
            stacks =
                from zz in stacks
                where
                    !zz.HealthStatus.StatusAt.HasValue
                    || zz.HealthStatus.StatusAt.Value
                        < DateTime.UtcNow - filter.HealthCheckAgeOlderThan.Value
                select zz;

            stacks =
                from zz in stacks
                from service in zz.Services
                where
                    !service.HealthStatus.StatusAt.HasValue
                    || service.HealthStatus.StatusAt.Value
                        < DateTime.UtcNow - filter.HealthCheckAgeOlderThan.Value
                select zz;
        }

        return await stacks.ToListAsync();
    }

    public async Task AddEnvironmentVariable(StackEnvironmentVariable variable)
    {
        await context.StackEnvironmentVariables.AddAsync(variable);
    }

    public async Task AddEnvironmentVariableGroups(IList<StackEnvironmentVariableGroup> groups)
    {
        await context.StackEnvironmentVariableGroups.AddRangeAsync(groups);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }

    private IQueryable<Deployment> GetDeploymentQuery(DeploymentsFilter filter)
    {
        IQueryable<Deployment> deployments = context.Deployments.Include(x => x.Stack);

        if (filter.StackId.HasValue)
        {
            deployments = from zz in deployments where zz.StackId == filter.StackId.Value select zz;
        }

        if (filter.ServerId.HasValue)
        {
            deployments =
                from zz in deployments
                where zz.Stack != null && zz.Stack.ServerId == filter.ServerId
                select zz;
        }

        return deployments.OrderByDescending(x => x.CreatedAt);
    }

    private async Task<Stack?> GetStackInternal(Guid id, bool throwExceptionOnNotFound = true)
    {
        var stack = await context
            .Stacks.Include(x => x.Services)
            .Include(x => x.Server)
            .Include(x => x.Environment)
            .ThenInclude(x => x!.Project)
            .Include(x => x.Source)
            .ThenInclude(x => x!.GithubApp)
            .ThenInclude(x => x!.SourceProvider)
            .ThenInclude(x => x!.GithubProvider)
            .Include(x => x.EnvironmentVariables)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (stack is null && throwExceptionOnNotFound)
        {
            throw new ArgumentNullException("Stack not found");
        }

        return stack;
    }
}
