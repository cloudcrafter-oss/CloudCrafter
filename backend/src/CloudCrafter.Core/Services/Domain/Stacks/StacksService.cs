using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StacksService(IStackRepository repository, IMapper mapper) : IStacksService
{
    public async Task<StackCreatedDto> CreateStack(CreateStackArgsDto args)
    {
        var createdStack = await repository.CreateStack(args);

        return new StackCreatedDto { Id = Guid.NewGuid() };
    }

    public async Task<SimpleStackDetailsDto?> GetSimpleStackDetails(Guid id)
    {
        var stack = await repository.GetStack(id);

        if (stack == null)
        {
            return null;
        }

        return mapper.Map<SimpleStackDetailsDto>(stack);
    }

    public async Task<StackDetailDto?> GetStackDetail(Guid id)
    {
        var stack = await repository.GetStack(id);

        if (stack == null)
        {
            return null;
        }

        return mapper.Map<StackDetailDto>(stack);
    }

    public Task<Guid> CreateDeployment(Guid stackId)
    {
        return repository.CreateDeployment(stackId);
    }
}
