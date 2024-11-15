using CloudCrafter.Core.Commands.Providers;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using MediatR;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterRecurringJobsDispatcher(ISender sender, IAgentManager agentManager)
    : ICloudCrafterRecurringJobsDispatcher
{
    public Task AddRecurringConnectivityChecks()
    {
        return sender.Send(new DispatchConnectivityChecksCommand.Query());
    }

    public Task AddRecurringHealthynessChecks()
    {
        return agentManager.RequestHealthChecks();
    }

    public Task AddMarkStacksAsUnknownWhenTimespanExceeded()
    {
        return sender.Send(new MarkStacksAsUnknownHealthAfterTimespan.Command());
    }

    public Task AddGitProviderStatusChecks()
    {
        return sender.Send(new ValidateProvidersCommand.Command());
    }
}
