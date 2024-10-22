using StackExchange.Redis;

namespace CloudCrafter.Core.Services.Core;

public class DistributedLockService : IDistributedLockService
{
    private readonly IDatabase _db;

    public DistributedLockService(string connectionString)
    {
        var redis = ConnectionMultiplexer.Connect(connectionString);
        _db = redis.GetDatabase();
    }

    public async Task<IDisposable?> AcquireLockAsync(
        string resourceKey,
        TimeSpan expiryTime,
        TimeSpan maxWaitTime
    )
    {
        var startTime = DateTime.UtcNow;
        var lockValue = Guid.NewGuid().ToString();
        while (DateTime.UtcNow - startTime < maxWaitTime)
        {
            if (await _db.LockTakeAsync(resourceKey, lockValue, expiryTime))
            {
                return new DistributedLock(_db, resourceKey, lockValue);
            }

            // Wait a bit before trying again
            await Task.Delay(10);
        }

        return null;
    }

    private class DistributedLock(IDatabase db, string resourceKey, string lockValue) : IDisposable
    {
        public void Dispose()
        {
            db.LockRelease(resourceKey, lockValue);
        }
    }
}
