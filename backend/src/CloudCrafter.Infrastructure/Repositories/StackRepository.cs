using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Events.DomainEvents;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class StackRepository(IApplicationDbContext context) : IStackRepository
{
    public async Task<Stack> CreateStack(CreateStackArgsDto args)
    {
        if (string.IsNullOrWhiteSpace(args.GitRepository))
        {
            throw new ArgumentOutOfRangeException("Not supported yet");
        }

        var stack = new Stack
        {
            Id = Guid.NewGuid(),
            Name = args.Name,
            EnvironmentId = args.EnvironmentId,
            ServerId = args.ServerId,
            // TODO: Handle source different
            Source = new ApplicationSource
            {
                Type = ApplicationSourceType.Git, Git = new ApplicationSourceGit { Repository = args.GitRepository }
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };


        context.Stacks.Add(stack);

        stack.AddDomainEvent(new StackUpdatedOrCreatedEvent(stack));
        
        await context.SaveChangesAsync();
        
        

        var stackFromDb = await GetStackInternal(stack.Id);

        return stackFromDb!;
    }

    public async Task<Stack?> GetStack(Guid id)
    {
        var stack = await GetStackInternal(id, false);

        return stack;
    }

    private async Task<Stack?> GetStackInternal(Guid id, bool throwExceptionOnNotFound = true)
    {
        var stack = await context.Stacks
            .Include(x => x.Server)
            .Include(x => x.Environment)
            .ThenInclude(x => x!.Project)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (stack is null && throwExceptionOnNotFound)
        {
            throw new ArgumentNullException("Stack not found");
        }

        return stack;
    }
}
