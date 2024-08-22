using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProjectRepository
{
    Task<List<ProjectDto>> GetProjects();
    Task<ProjectDto> CreateProject(string name);
}
