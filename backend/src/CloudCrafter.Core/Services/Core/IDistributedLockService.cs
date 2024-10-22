namespace CloudCrafter.Core.Services.Core;

public interface IDistributedLockService
{
    Task<IDisposable?> AcquireLockAsync(
        string resourceKey,
        TimeSpan expiryTime,
        TimeSpan maxWaitTime
    );
}
