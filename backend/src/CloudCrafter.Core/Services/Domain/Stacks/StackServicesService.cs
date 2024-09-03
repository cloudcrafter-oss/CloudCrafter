using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackServicesService(IStackRepository stackRepository) : IStackServicesService
{
    public async Task AddAppServiceToStack(Guid stackId, string name)
    {
        await stackRepository.AddAppServiceToStack(stackId, name);
    }
}
