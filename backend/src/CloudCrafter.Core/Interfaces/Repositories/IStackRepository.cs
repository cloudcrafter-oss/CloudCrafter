using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Domain.Stack.Filter;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Requests.Filtering;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IStackRepository
{
    Task<Stack> CreateStack(CreateStackArgsDto args);
    Task<Stack?> GetStack(Guid id);
    Task AddAppServiceToStack(Guid stackId, string name);

    Task<Guid> CreateDeployment(Guid stackId);
    Task<StackService?> GetService(Guid stackServiceId);
    Task<List<Deployment>> GetDeployments(DeploymentsFilter filter);

    Task<List<Stack>> FilterStacks(StackFilter filter);

    Task SaveChangesAsync();

    Task<PaginatedList<SimpleDeploymentDto>> GetDeploymentsPaginated(
        DeploymentsFilter filter,
        BasePaginationRequest paginatedRequest
    );

    Task AddEnvironmentVariable(StackEnvironmentVariable variable);
    Task<List<StackEnvironmentVariable>> GetEnvironmentVariables(Guid stackId);

    Task AddEnvironmentVariableGroups(IList<StackEnvironmentVariableGroup> groups);

    Task<List<StackEnvironmentVariableGroup>> GetEnvironmentVariableGroups(Guid stackId);
}
