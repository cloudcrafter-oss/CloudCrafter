using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StacksService(IStackRepository repository) : IStacksService
{
    public async Task<StackCreatedDto> CreateStack(CreateStackArgsDto args)
    {
        var createdStack = await repository.CreateStack(args);

        return new StackCreatedDto { Id = Guid.NewGuid() };
    }
}
