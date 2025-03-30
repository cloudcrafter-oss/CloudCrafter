using CloudCrafter.Core.Commands.Stacks.Service;
using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStackServicesService
{
    Task AddAppServiceToStack(Guid stackId, string name);
    Task<StackServiceDto?> UpdateStackService(UpdateStackServiceCommand request);
}
