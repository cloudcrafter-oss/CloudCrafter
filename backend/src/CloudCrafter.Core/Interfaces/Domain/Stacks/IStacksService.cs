using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStacksService
{
    Task<StackCreatedDto> CreateStack(CreateStackArgsDto args);
    Task<SimpleStackDetailsDto?> GetSimpleStackDetails(Guid id);
    Task<StackDetailDto?> GetStackDetail(Guid id);

    Task<Guid> CreateDeployment(Guid stackId);
}
