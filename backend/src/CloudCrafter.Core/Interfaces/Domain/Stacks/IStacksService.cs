using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Interfaces.Domain.Stacks;

public interface IStacksService
{
    Task<StackCreatedDto> CreateStack(string name, string gitRepository);
}
