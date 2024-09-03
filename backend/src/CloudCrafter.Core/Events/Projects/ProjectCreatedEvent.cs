using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Events.Projects;

public record ProjectCreatedEvent(Project CreatedProject) : IDomainEvent;
