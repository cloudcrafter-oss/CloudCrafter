using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StacksService(IStackRepository repository) : IStacksService
{
    public async Task<StackCreatedDto> CreateStack(string name, string gitRepository)
    {
        var createdStack = await repository.CreateStack(name, gitRepository);

        return new() { Id = Guid.NewGuid() };
    }
}
