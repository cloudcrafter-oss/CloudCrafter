using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Interfaces.Domain.Projects;

public interface IProjectsService
{
    Task<List<ProjectDto>> GetProjects(LoadProjectOptions options);
    Task<ProjectDto> CreateProject(string name);
    Task<ProjectDto?> GetProject(Guid id);
    Task<ProjectDto> UpdateProject(Guid id, UpdateProjectArgs updateValues);
    Task DeleteProject(Guid id);
    Task<ProjectEnvironmentEnhancedDto?> GetProjectEnvironmentEnhancedDetails(
        Guid projectId,
        Guid environmentId
    );
}
