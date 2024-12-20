﻿using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class GetServerSimpleDeploymentsTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetServerSimpleDeployments.Query(Guid.NewGuid(), new()))
        );
    }

    [Test]
    [Ignore("TODO: ACL check not yet implemented")]
    public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var serverId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetServerSimpleDeployments.Query(serverId, new PaginatedRequest<SimpleDeploymentDto>()))
        );

        ex.Message.Should().Be($"User does not have access to server {serverId}");
    }

    [Test]
    public async Task ShouldBeAbleToFetchDeployments()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);
        var result = await SendAsync(new GetServerSimpleDeployments.Query(server.Id, new PaginatedRequest<SimpleDeploymentDto>()));

        result.Result.Count.Should().Be(0);
    }
}
