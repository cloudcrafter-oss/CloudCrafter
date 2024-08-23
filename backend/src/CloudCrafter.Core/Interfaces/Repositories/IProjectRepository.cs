using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProjectRepository
{
    Task<List<ProjectDto>> GetProjects(LoadProjectOptions options);
    Task<ProjectDto> CreateProject(string name);
    Task<ProjectDto?> GetProject(Guid id);
    Task<ProjectDto> UpdateProject(Guid id, UpdateProjectArgs updateValues);
}
