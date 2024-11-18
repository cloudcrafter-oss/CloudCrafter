namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterRecurringJobsDispatcher
{
    Task AddRecurringConnectivityChecks();
    Task AddRecurringHealthynessChecks();
    Task MarkEntitiesAsUnknownWhenTimespanExceeded();
    Task AddGitProviderStatusChecks();
}
