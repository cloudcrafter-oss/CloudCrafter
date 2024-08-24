namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IEnvironmentRepository
{
    Task CreateEnvironment(string name, Guid projectId);
}
