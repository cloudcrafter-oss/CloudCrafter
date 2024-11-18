using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStacksService
{
    Task<StackCreatedDto> CreateStack(CreateStackArgsDto args);
    Task<SimpleStackDetailsDto?> GetSimpleStackDetails(Guid id);
    Task<StackDetailDto?> GetStackDetail(Guid id);

    Task<Guid> CreateDeployment(Guid stackId);
    Task<List<SimpleDeploymentDto>> GetDeployments(DeploymentsFilter filter);
    Task HandleHealthChecks(Guid serverId, ContainerHealthCheckArgs args);
    Task<StackDetailDto?> UpdateStack(UpdateStackCommand.Command request);

    Task MarkStacksUnknownAfterTimespan(TimeSpan maxHealthCheckAge);
}
