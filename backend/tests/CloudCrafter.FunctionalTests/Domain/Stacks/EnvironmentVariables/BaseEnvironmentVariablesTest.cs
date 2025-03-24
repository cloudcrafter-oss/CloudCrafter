using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public abstract class BaseEnvironmentVariablesTest : BaseTestFixture
{
    public async Task AssertEnvCount(int count)
    {
        (await CountAsync<StackEnvironmentVariable>()).Should().Be(count);
    }

    public async Task AssertEnvGroupCount(int count)
    {
        (await CountAsync<StackEnvironmentVariableGroup>()).Should().Be(count);
    }
}
