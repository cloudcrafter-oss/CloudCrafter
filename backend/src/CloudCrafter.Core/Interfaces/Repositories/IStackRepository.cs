namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IStackRepository
{
    Task<object> CreateStack(string name, string gitRepository);
}
