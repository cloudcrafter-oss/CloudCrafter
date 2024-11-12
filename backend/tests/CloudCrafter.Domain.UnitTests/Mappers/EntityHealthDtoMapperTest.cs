using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public class EntityHealthDtoMapperTest : BaseMapperTest
{
    [Test]
    [TestCase(EntityHealthStatusValue.Unknown, EntityHealthDtoValue.Unknown)]
    [TestCase(EntityHealthStatusValue.Unsupported, EntityHealthDtoValue.Unsupported)]
    [TestCase(EntityHealthStatusValue.Degraded, EntityHealthDtoValue.Degraded)]
    [TestCase(EntityHealthStatusValue.Unhealthy, EntityHealthDtoValue.Unhealthy)]
    [TestCase(EntityHealthStatusValue.Healthy, EntityHealthDtoValue.Healthy)]
    [TestCase(EntityHealthStatusValue.HealthCheckOverdue, EntityHealthDtoValue.HeathCheckOverdue)]
    public void ShouldMapEntityHealthStatus(
        EntityHealthStatusValue entity,
        EntityHealthDtoValue dto
    )
    {
        var dateTime = DateTime.UtcNow.AddDays(-1);
        // Arrange
        var entityHealthStatus = new EntityHealthStatus { Value = entity, StatusAt = dateTime };

        // Act
        var entityHealthDto = _mapper.Map<EntityHealthDto>(entityHealthStatus);

        // Assert
        entityHealthDto.Value.Should().Be(dto);
        entityHealthDto.StatusAt.Should().Be(dateTime);
    }
}
