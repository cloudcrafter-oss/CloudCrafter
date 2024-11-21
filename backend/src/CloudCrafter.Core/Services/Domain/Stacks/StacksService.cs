﻿using AutoMapper;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Domain.Stack.Filter;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Requests.Filtering;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StacksService(IStackRepository repository, IMapper mapper) : IStacksService
{
    public async Task<StackCreatedDto> CreateStack(CreateStackArgsDto args)
    {
        var createdStack = await repository.CreateStack(args);

        return new StackCreatedDto { Id = createdStack.Id };
    }

    public async Task<SimpleStackDetailsDto?> GetSimpleStackDetails(Guid id)
    {
        var stack = await repository.GetStack(id);

        if (stack == null)
        {
            return null;
        }

        return mapper.Map<SimpleStackDetailsDto>(stack);
    }

    public async Task<StackDetailDto?> GetStackDetail(Guid id)
    {
        var stack = await repository.GetStack(id);

        if (stack == null)
        {
            return null;
        }

        return mapper.Map<StackDetailDto>(stack);
    }

    public Task<Guid> CreateDeployment(Guid stackId)
    {
        return repository.CreateDeployment(stackId);
    }

    public async Task<List<SimpleDeploymentDto>> GetDeployments(DeploymentsFilter filter)
    {
        var deployments = await repository.GetDeployments(filter);

        return mapper.Map<List<SimpleDeploymentDto>>(deployments);
    }

    public Task<PaginatedList<SimpleDeploymentDto>> GetDeploymentsPaginated(DeploymentsFilter filter,
        BasePaginationRequest paginatedRequest)
    {
        return repository.GetDeploymentsPaginated(filter, paginatedRequest);
    }

    public async Task HandleHealthChecks(Guid serverId, ContainerHealthCheckArgs args)
    {
        foreach (var stackInfo in args.Info)
        {
            var stackId = stackInfo.Key;

            var stackEntity = await repository.GetStack(stackId);

            if (stackEntity == null || stackEntity.ServerId != serverId)
            {
                continue;
            }

            var allAreHealthy = stackInfo.Value.StackServices.All(x =>
                x.Value.Status == ContainerHealthCheckStackInfoHealthStatus.Healthy
            );

            var allAreUnhealthy = stackInfo.Value.StackServices.All(x =>
                x.Value.Status == ContainerHealthCheckStackInfoHealthStatus.Unhealthy
            );
            stackEntity.HealthStatus.SetStatus(
                allAreHealthy ? EntityHealthStatusValue.Healthy
                : allAreUnhealthy ? EntityHealthStatusValue.Unhealthy
                : EntityHealthStatusValue.Degraded
            );

            stackEntity.AddDomainEvent(
                DomainEventDispatchTiming.AfterSaving,
                new StackHealthUpdatedEvent(stackEntity)
            );
            foreach (var stackService in stackInfo.Value.StackServices)
            {
                var stackServiceId = stackService.Key;

                // TODO: Move this to Unit of Work
                var stackServiceEntity = await repository.GetService(stackServiceId);

                if (stackServiceEntity?.Stack.ServerId != serverId)
                {
                    continue;
                }

                var isRunning = stackService.Value.IsRunning;

                stackServiceEntity?.HealthStatus.SetStatus(
                    stackService.Value.Status == ContainerHealthCheckStackInfoHealthStatus.Healthy
                        ? EntityHealthStatusValue.Healthy
                        : stackService.Value.Status
                          == ContainerHealthCheckStackInfoHealthStatus.Unhealthy
                            ? EntityHealthStatusValue.Unhealthy
                            : EntityHealthStatusValue.Degraded,
                    isRunning
                );
            }
        }

        await repository.SaveChangesAsync();
    }

    public async Task<StackDetailDto?> UpdateStack(UpdateStackCommand.Command request)
    {
        var stack = await repository.GetStack(request.StackId);

        if (stack == null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            stack.Name = request.Name;
        }

        if (!string.IsNullOrWhiteSpace(request.Description))
        {
            stack.Description = request.Description;
        }

        if (stack.Source?.Git != null)
        {
            // Update git related settings

            if (!string.IsNullOrWhiteSpace(request.GitSettings?.GitRepository))
            {
                stack.Source.Git.Repository = request.GitSettings.GitRepository;
            }

            if (!string.IsNullOrWhiteSpace(request.GitSettings?.GitBranch))
            {
                stack.Source.Git.Branch = request.GitSettings.GitBranch;
            }

            if (!string.IsNullOrWhiteSpace(request.GitSettings?.GitPath))
            {
                stack.Source.Git.Path = request.GitSettings.GitPath;
            }
        }

        stack.AddDomainEvent(DomainEventDispatchTiming.AfterSaving, new StackUpdatedEvent(stack));

        await repository.SaveChangesAsync();

        return mapper.Map<StackDetailDto>(stack);
    }

    public async Task MarkStacksUnknownAfterTimespan(TimeSpan maxHealthCheckAge)
    {
        var stacks = await repository.FilterStacks(
            new StackFilter { HealthCheckAgeOlderThan = maxHealthCheckAge }
        );

        foreach (var stack in stacks)
        {
            stack.HealthStatus.SetStatus(EntityHealthStatusValue.HealthCheckOverdue);

            foreach (var service in stack.Services)
            {
                if (
                    !service.HealthStatus.StatusAt.HasValue
                    || service.HealthStatus.StatusAt.Value < DateTime.UtcNow - maxHealthCheckAge
                )
                {
                    service.HealthStatus.SetStatus(EntityHealthStatusValue.HealthCheckOverdue);
                }
            }
        }

        await repository.SaveChangesAsync();
    }
}
