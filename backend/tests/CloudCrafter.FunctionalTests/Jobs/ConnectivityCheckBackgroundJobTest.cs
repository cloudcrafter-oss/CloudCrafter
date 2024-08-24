using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Entities.Jobs;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Serilog;
using BackgroundJob = CloudCrafter.Domain.Entities.BackgroundJob;

namespace CloudCrafter.FunctionalTests.Jobs;

using static Testing;

public class ConnectivityCheckBackgroundJobTest : BaseTestFixture
{
    [SetUp]
    public Task SetUp()
    {
        return StartTestingHost();
    }
    [Test]
    public async Task ShouldBeAbleToSuccessfullyRunConnectivityJob()
    {
        (await CountAsync<BackgroundJob>()).Should().Be(0);
        (await CountAsync<ServerConnectivityCheckJob>()).Should().Be(0);
        (await CountAsync<Server>()).Should().Be(0);


        var server = TestingHostServerFaker().Generate();
        await AddAsync(server);

        (await CountAsync<Server>()).Should().Be(1);
        var dispatcher = GetService<ICloudCrafterDispatcher>();

        var jobId = await dispatcher.EnqueueConnectivityCheck(server);

        WaitForJobCompletion(jobId);

        (await CountAsync<BackgroundJob>()).Should().Be(1);
        (await CountAsync<ServerConnectivityCheckJob>()).Should().Be(1);

        var job = FetchEntity<BackgroundJob>(x => x.HangfireJobId == jobId,
            f => f.Include(x => x.ServerConnectivityCheckJob)
                .ThenInclude(x => x != null ? x.Server : null));

        job.Should().NotBeNull();
        job!.ServerConnectivityCheckJob.Should().NotBeNull();
        job.ServerConnectivityCheckJob!.Server.Should().NotBeNull();
        job.ServerConnectivityCheckJob.ServerId.Should().Be(server.Id);
        job.ServerConnectivityCheckJob.Server.Name.Should().Be(server.Name);

        job.Status.Should().Be(BackgroundJobStatus.Completed);
        job.ServerConnectivityCheckJob.Result.Should().Be(ServerConnectivityCheckResult.Healthy);

        job.RunningTime.Should().BeGreaterThan(1);
        job.ServerConnectivityCheckJob.TimeTakenMs.Should().BeGreaterThan(1);
        job.Logs.Where(x => !string.IsNullOrEmpty(x.Exception)).ToList().Count.Should().Be(0);
        job.Logs.Count.Should().BeGreaterThan(0);
    }

    [Test]
    public async Task ShouldBeAbleToSuccessfullyRunConnectivityJobButUnhealthy()
    {
        (await CountAsync<BackgroundJob>()).Should().Be(0);
        (await CountAsync<ServerConnectivityCheckJob>()).Should().Be(0);
        (await CountAsync<Server>()).Should().Be(0);


        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        (await CountAsync<Server>()).Should().Be(1);
        var dispatcher = GetService<ICloudCrafterDispatcher>();

        var jobId = await dispatcher.EnqueueConnectivityCheck(server);

        WaitForJobCompletion(jobId);

        (await CountAsync<BackgroundJob>()).Should().Be(1);
        (await CountAsync<ServerConnectivityCheckJob>()).Should().Be(1);

        var job = FetchEntity<BackgroundJob>(x => x.HangfireJobId == jobId,
            f => f.Include(x => x.ServerConnectivityCheckJob)
                .ThenInclude(x => x != null ? x.Server : null));

        job.Should().NotBeNull();
        job!.ServerConnectivityCheckJob.Should().NotBeNull();
        job.ServerConnectivityCheckJob!.Server.Should().NotBeNull();
        job.ServerConnectivityCheckJob.ServerId.Should().Be(server.Id);
        job.ServerConnectivityCheckJob.Server.Name.Should().Be(server.Name);

        job.Status.Should().Be(BackgroundJobStatus.Completed);
        job.ServerConnectivityCheckJob.Result.Should().Be(ServerConnectivityCheckResult.Unhealthy);

        job.RunningTime.Should().BeGreaterThan(1);
        job.ServerConnectivityCheckJob.TimeTakenMs.Should().BeGreaterThan(1);
        job.Logs.Where(x => !string.IsNullOrEmpty(x.Exception)).ToList().Count.Should().BeGreaterThan(0);
    }
}
