using CloudCrafter.Domain.Domain.Health;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public class StackServiceDtoMapperTest : BaseMapperTest
{
    [Test]
    public void ShouldMapStackServiceToStackServiceDto()
    {
        var dateYesterday = DateTime.UtcNow.AddDays(-1);
        var stackTypeId = Guid.NewGuid();
        var stackService = new StackService
        {
            Id = Guid.NewGuid(),
            Name = "Service",
            StackId = Guid.NewGuid(),
            StackServiceTypeId = stackTypeId,
            Type = new StackServiceType { Id = stackTypeId, Type = "App" },
            HealthStatus = new EntityHealthStatus
            {
                Value = EntityHealthStatusValue.Unsupported, StatusAt = dateYesterday
            },
            HttpConfiguration = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var stackServiceDto = _mapper.Map<StackServiceDto>(stackService);

        stackServiceDto.Id.Should().Be(stackService.Id);
        stackServiceDto.Name.Should().Be(stackService.Name);
        stackServiceDto.Health.Value.Should().Be(EntityHealthDtoValue.Unsupported);
        stackServiceDto.Health.StatusAt.Should().Be(dateYesterday);
    }
}
