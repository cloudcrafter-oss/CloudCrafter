using Hangfire;
using Hangfire.States;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests;

using static Testing;

[TestFixture]
public abstract class BaseTestFixture
{
    [SetUp]
    public async Task TestSetUp()
    {
        await ResetState();
    }
    
    public void WaitForJobCompletion(string jobId, int timeoutInSeconds = 30)
    {
        var startTime = DateTime.Now;
        using (var connection = JobStorage.Current.GetConnection())
        {
            while (true)
            {
                var jobData = connection.GetJobData(jobId);
                if (jobData.State == SucceededState.StateName)
                {
                    return;
                }

                if ((DateTime.Now - startTime).TotalSeconds > timeoutInSeconds)
                {
                    throw new TimeoutException($"Job {jobId} did not complete within the timeout period.");
                }

                Thread.Sleep(500); // Check every 500 milliseconds
            }
        }
    }
}
