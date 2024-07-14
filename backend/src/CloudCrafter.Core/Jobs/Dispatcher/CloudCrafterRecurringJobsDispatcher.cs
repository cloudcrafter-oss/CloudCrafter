using CloudCrafter.Core.Commands.Servers;
using MediatR;

namespace CloudCrafter.Core.Jobs.Dispatcher;

public class CloudCrafterRecurringJobsDispatcher(ISender sender) : ICloudCrafterRecurringJobsDispatcher
{
    public Task AddRecurringConnectivityChecks()
    {
        return sender.Send(new DispatchConnectivityChecksCommand.Query());
    }
}
