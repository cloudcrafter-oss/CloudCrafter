using CloudCrafter.Core.SignalR.Tracking;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using StackExchange.Redis;

namespace CloudCrafter.FunctionalTests.SignalR.Tracking;

using static Testing;

public class PresenceTrackingTest : BaseTestFixture
{
    private IDatabase _db;
    private IConnectionMultiplexer _redis;
    private PresenceTracker _tracker;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        _redis = _factory.Services.GetRequiredService<IConnectionMultiplexer>();
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _redis.Dispose();
    }

    [SetUp]
    public void Setup()
    {
        _db = _redis.GetDatabase();
        _tracker = new PresenceTracker(_redis);
        // Clear relevant keys before each test
        ClearRedisKeys().Wait();
    }

    private async Task ClearRedisKeys()
    {
        var endpoints = _redis.GetEndPoints();
        var server = _redis.GetServer(endpoints.First());
        var keys = server.Keys(pattern: $"*{typeof(TestHub).Name}*").ToArray();
        if (keys.Any())
        {
            await _db.KeyDeleteAsync(keys);
        }
    }

    [Test]
    public async Task FullLifecycle_ShouldTrackPresenceCorrectly()
    {
        // Arrange
        var connectionId = "integration_conn_1";
        var anotherConnectionId = "integration_conn_2";
        var groupId1 = "integration_group_1";
        var groupId2 = "integration_group_2";
        var groupId3 = "integration_group_3";

        // Act & Assert - Join groups
        await _tracker.ClientJoinedGroup<TestHub>(connectionId, groupId1);
        await _tracker.ClientJoinedGroup<TestHub>(connectionId, groupId2);
        await _tracker.ClientJoinedGroup<TestHub>(anotherConnectionId, groupId3);

        // Verify groups for connection
        var groups = await _tracker.GroupsForConnection<TestHub>(connectionId);
        CollectionAssert.AreEquivalent(new[] { groupId1, groupId2 }, groups);

        // Leave one group
        await _tracker.ClientLeftGroup<TestHub>(connectionId, groupId1);
        groups = await _tracker.GroupsForConnection<TestHub>(connectionId);
        CollectionAssert.AreEquivalent(new[] { groupId2 }, groups);

        // Cleanup all groups
        await _tracker.CleanupGroupsForConnection<TestHub>(connectionId);
        groups = await _tracker.GroupsForConnection<TestHub>(connectionId);
        Assert.That(groups, Is.Empty);
    }

    [Test]
    public async Task FullLifecycle_ShouldCleanupGroupsForConnectionCorrectly()
    {
        // Arrange
        var connectionId = "integration_conn_1";
        var anotherConnectionId = "integration_conn_2";
        var groupId1 = "integration_group_1";
        var groupId2 = "integration_group_2";
        var groupId3 = "integration_group_3";

        // Act & Assert - Join groups
        await _tracker.ClientJoinedGroup<TestHub>(connectionId, groupId1);
        await _tracker.ClientJoinedGroup<TestHub>(connectionId, groupId2);
        await _tracker.ClientJoinedGroup<TestHub>(connectionId, groupId3);
        await _tracker.ClientJoinedGroup<TestHub>(anotherConnectionId, groupId2);

        // Verify groups for connection
        var groups = await _tracker.GroupsForConnection<TestHub>(connectionId);
        CollectionAssert.AreEquivalent(new[] { groupId1, groupId2, groupId3 }, groups);

        // Disconnect
        await _tracker.CleanupGroupsForConnection<TestHub>(connectionId);
        groups = await _tracker.GroupsForConnection<TestHub>(connectionId);
        Assert.That(groups, Is.Empty);

        groups = await _tracker.GroupsForConnection<TestHub>(anotherConnectionId);
        CollectionAssert.AreEquivalent(new[] { groupId2 }, groups);
    }

    private class TestHub : IPresenceTrackingHub
    {
        public string HubName => "TestHub";
    }
}
