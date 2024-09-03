using CloudCrafter.Core.Events.Projects;
using CloudCrafter.Core.Interfaces.Domain.Environments;

namespace CloudCrafter.Core.Events.Handlers;

public class ProjectCreatedEventHandler(IEnvironmentService environmentService) : IDomainEventHandler<ProjectCreatedEvent>
{
    public Task HandleAsync(ProjectCreatedEvent domainEvent)
    {
        return environmentService.CreateDefaultEnvironmentForProject(domainEvent.CreatedProject.Id);
    }
}
