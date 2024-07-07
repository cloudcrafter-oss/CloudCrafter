using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Interfaces.Domain.Projects;

public interface IProjectsService
{
    Task<List<ProjectDto>> GetProjects();
}
