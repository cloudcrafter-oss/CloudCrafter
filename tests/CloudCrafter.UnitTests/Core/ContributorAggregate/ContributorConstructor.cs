using CloudCrafter.Core.ContributorAggregate;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.UnitTests.Core.ContributorAggregate;

public class ContributorConstructor
{
    private readonly string _testName = "test name";
    private Contributor? _testContributor;

    private Contributor CreateContributor()
    {
        return new Contributor(_testName);
    }

    [Test]
    public void InitializesName()
    {
        _testContributor = CreateContributor();
        _testName.Should().Be(_testContributor.Name);
    }
}
