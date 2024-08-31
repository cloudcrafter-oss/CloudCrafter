using AutoMapper;
using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Core.Events;
using CloudCrafter.Core.Events.Projects;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Services.Domain.Projects;

public class ProjectsService(
    IProjectRepository repository,
    IEnvironmentRepository environmentRepository,
    IMapper mapper,
    IEventStore eventStore) : IProjectsService
{
    public Task<List<ProjectDto>> GetProjects(LoadProjectOptions options)
    {
        return repository.GetProjects(options);
    }

    public async Task<ProjectDto> CreateProject(string name)
    {
        var createdProject = await repository.CreateProject(name);

        await eventStore.PublishAsync(new ProjectCreatedEvent(createdProject));

        return mapper.Map<ProjectDto>(createdProject);
    }

    public Task<ProjectDto?> GetProject(Guid id)
    {
        return repository.GetProject(id);
    }

    public Task<ProjectDto> UpdateProject(Guid id, UpdateProjectArgs updateValues)
    {
        return repository.UpdateProject(id, updateValues);
    }

    public Task DeleteProject(Guid id)
    {
        return repository.DeleteProject(id);
    }

    public async Task<ProjectEnvironmentEnhancedDto?> GetProjectEnvironmentEnhancedDetails(Guid projectId,
        Guid environmentId)
    {
        var environment = await environmentRepository.GetEnvironment(environmentId, projectId);

        if (environment?.Project is null)
        {
            return null;
        }

        // TODO: Fix dummy code

        var randomBool = new Random().Next(0, 2) == 1;
        DateTime? lastDeploymentDate = null;
        if (randomBool)
        {
            lastDeploymentDate = DateTime.UtcNow.AddDays(-1);
        }

        var randomNumberOfDeployedApplications = new Random().Next(1, 11);

        var dto = new ProjectEnvironmentEnhancedDto
        {
            EnvironmentName = environment.Name,
            DeployedApplications = new List<DeployedApplicationDto>(),
            EnvironmentCreatedAt = environment.CreatedAt,
            ProjectName = environment.Project.Name,
            DeployedApplicationsCount = randomNumberOfDeployedApplications,
            LastDeploymentAt = lastDeploymentDate
        };

        return dto;
    }
}
