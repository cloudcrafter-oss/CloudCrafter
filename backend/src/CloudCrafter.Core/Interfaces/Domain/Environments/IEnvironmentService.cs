namespace CloudCrafter.Core.Interfaces.Domain.Environments;

public interface IEnvironmentService
{
    Task CreateDefaultEnvironmentForProject(Guid projectId);
}
