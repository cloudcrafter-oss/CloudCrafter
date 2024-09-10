using CloudCrafter.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace CloudCrafter.Infrastructure.Data.Interceptors;

public class DispatchDomainEventsInterceptor : SaveChangesInterceptor
{
    private readonly IMediator _mediator;

    public DispatchDomainEventsInterceptor(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result
    )
    {
        DispatchDomainEvents(eventData.Context, DomainEventDispatchTiming.BeforeSaving)
            .GetAwaiter()
            .GetResult();

        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        await DispatchDomainEvents(eventData.Context, DomainEventDispatchTiming.BeforeSaving);

        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public override int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        DispatchDomainEvents(eventData.Context, DomainEventDispatchTiming.AfterSaving)
            .GetAwaiter()
            .GetResult();

        return base.SavedChanges(eventData, result);
    }

    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default
    )
    {
        await DispatchDomainEvents(eventData.Context, DomainEventDispatchTiming.AfterSaving);
        return await base.SavedChangesAsync(eventData, result, cancellationToken);
    }

    public async Task DispatchDomainEvents(DbContext? context, DomainEventDispatchTiming timing)
    {
        if (context == null)
        {
            return;
        }

        var entities = context
            .ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any(de => de.Timing == timing))
            .Select(e => e.Entity);

        var domainEvents = entities
            .SelectMany(e => e.DomainEvents.Where(x => x.Timing == timing))
            .ToList();

        entities.ToList().ForEach(e => e.ClearDomainEvents(timing));

        foreach (var domainEvent in domainEvents)
        {
            await _mediator.Publish(domainEvent.Event);
        }
    }
}
