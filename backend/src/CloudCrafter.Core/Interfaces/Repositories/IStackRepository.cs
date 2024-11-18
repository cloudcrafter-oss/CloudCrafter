using CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Domain.Stack.Filter;
using CloudCrafter.Domain.Entities;

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
}
