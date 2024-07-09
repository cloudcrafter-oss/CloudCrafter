using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Services.Domain.Projects;

public class ProjectsService(IProjectRepository repository) : IProjectsService
{
    public Task<List<ProjectDto>> GetProjects()
    {
        return repository.GetProjects();
    }
}
