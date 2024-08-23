using CloudCrafter.Core.Commands.Projects;
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

    public Task<ProjectDto> CreateProject(string name)
    {
        return repository.CreateProject(name);
    }

    public Task<ProjectDto?> GetProject(Guid id)
    {
        return repository.GetProject(id);
    }

    public Task<ProjectDto> UpdateProject(Guid id, UpdateProjectArgs updateValues)
    {
        return repository.UpdateProject(id, updateValues);
    }
}
