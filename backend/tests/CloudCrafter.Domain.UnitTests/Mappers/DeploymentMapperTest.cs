using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public class DeploymentMapperTest : BaseMapperTest
{
    [Test]
    [TestCase(DeploymentState.Created, DeploymentStatusDto.Created)]
    [TestCase(DeploymentState.Running, DeploymentStatusDto.Running)]
    [TestCase(DeploymentState.Failed, DeploymentStatusDto.Failed)]
    [TestCase(DeploymentState.Succeeded, DeploymentStatusDto.Succeeded)]
    public void ShouldMapSimpleDeploymentDtoEnumValues(
        DeploymentState entity,
        DeploymentStatusDto dto
    )
    {
        var dateTime = DateTime.UtcNow.AddDays(-1);
        // Arrange
        var deploymnetEntity = new Deployment
        {
            Id = Guid.NewGuid(),
            StackId = Guid.NewGuid(),
            Logs = new List<DeploymentLog>(),
            State = entity,
            CreatedAt = dateTime,
            UpdatedAt = dateTime,
        };

        // Act
        var deploymentDto = _mapper.Map<SimpleDeploymentDto>(deploymnetEntity);

        // Assert
        deploymentDto.State.Should().Be(dto);
        deploymentDto.CreatedAt.Should().Be(dateTime);
        deploymentDto.Id.Should().Be(deploymentDto.Id);
    }
}
