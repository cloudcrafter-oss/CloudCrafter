using System.ComponentModel.DataAnnotations.Schema;

namespace CloudCrafter.Domain.Common;

public abstract class BaseEntity
{
    private readonly List<(BaseEvent Event, DomainEventDispatchTiming Timing)> _domainEvents = new();
    public required Guid Id { get; set; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; set; }

    [NotMapped]
    public IReadOnlyCollection<(BaseEvent Event, DomainEventDispatchTiming Timing)> DomainEvents =>
        _domainEvents.AsReadOnly();

    public void AddDomainEvent(DomainEventDispatchTiming timing, BaseEvent domainEvent)
    {
        _domainEvents.Add((domainEvent, timing));
    }

    public void RemoveDomainEvent(BaseEvent domainEvent, DomainEventDispatchTiming timing)
    {
        _domainEvents.Remove((domainEvent, timing));
    }

    public void ClearDomainEvents(DomainEventDispatchTiming timing)
    {
        _domainEvents.RemoveAll(x => x.Timing == timing);
    }
}

public enum DomainEventDispatchTiming
{
    BeforeSaving,
    AfterSaving
}
