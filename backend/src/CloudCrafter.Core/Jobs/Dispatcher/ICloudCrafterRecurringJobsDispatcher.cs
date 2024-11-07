namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterRecurringJobsDispatcher
{
    Task AddRecurringConnectivityChecks();
    Task AddRecurringHealthynessChecks();
}
