namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStackServicesService
{
    Task AddAppServiceToStack(Guid stackId, string name);
}
