using Ardalis.SharedKernel;
using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Core.Services;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NUnit.Framework;

namespace CloudCrafter.UnitTests.Core.Services;

public class DeleteContributorService_DeleteContributor
{
    private readonly IRepository<Contributor> _repository = Substitute.For<IRepository<Contributor>>();
    private readonly IMediator _mediator = Substitute.For<IMediator>();
    private readonly ILogger<DeleteContributorService> _logger = Substitute.For<ILogger<DeleteContributorService>>();

    private readonly DeleteContributorService _service;

    public DeleteContributorService_DeleteContributor()
    {
        _service = new DeleteContributorService(_repository, _mediator, _logger);
    }

    [Test]
    public async Task ReturnsNotFoundGivenCantFindContributor()
    {
        var result = await _service.DeleteContributor(0);
        result.Status.Should().Be(Ardalis.Result.ResultStatus.NotFound);
    }
}
