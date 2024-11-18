using CloudCrafter.Core.Commands.Providers;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Jobs.Servers;
using MediatR;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterRecurringJobsDispatcher(
    ISender sender,
    IAgentManager agentManager,
    ICloudCrafterDispatcher dispatcher
) : ICloudCrafterRecurringJobsDispatcher
{
    public Task AddRecurringConnectivityChecks()
    {
        return sender.Send(new DispatchConnectivityChecksCommand.Query());
    }

    public Task AddRecurringHealthynessChecks()
    {
        return agentManager.RequestHealthChecks();
    }

    public async Task MarkEntitiesAsUnknownWhenTimespanExceeded()
    {
        await sender.Send(new MarkStacksAsUnknownHealthAfterTimespan.Command());
        var serverJob = new MarkServersUnknownAfterTimespanJob();
        dispatcher.DispatchJob(serverJob);
    }

    public Task AddGitProviderStatusChecks()
    {
        return sender.Send(new ValidateProvidersCommand.Command());
    }
}
