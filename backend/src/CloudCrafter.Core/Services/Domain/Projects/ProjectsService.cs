using AutoMapper;
using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Core.Events;
using CloudCrafter.Core.Events.Projects;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Project;

namespace CloudCrafter.Core.Services.Domain.Projects;

public class ProjectsService(IProjectRepository repository, IMapper mapper, IEventStore eventStore) : IProjectsService
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
}
