using CloudCrafter.Core.Commands.Servers;
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
}
