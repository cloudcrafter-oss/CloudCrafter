using CloudCrafter.Core.Interfaces.Repositories;

namespace CloudCrafter.Infrastructure.Repositories;

public class StackRepository : IStackRepository
{
    public Task<object> CreateStack(string name, string gitRepository)
    {
        return Task.FromResult<object>(new { });
    }
}
