using Bogus;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
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

    public async Task<Stack> CreateSampleStack()
    {
        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stack = FakerInstances
            .StackFaker(environment.Id)
            .RuleFor(x => x.ServerId, server.Id)
            .Generate();
        await AddAsync(stack);

        return stack;
    }
}
