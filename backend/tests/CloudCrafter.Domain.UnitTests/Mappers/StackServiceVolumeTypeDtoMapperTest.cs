using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public class StackServiceVolumeTypeDtoMapperTest : BaseMapperTest
{
    [Test]
    [TestCase(StackServiceVolumeType.DockerVolume, StackServiceVolumeTypeDto.DockerVolume)]
    [TestCase(StackServiceVolumeType.LocalMount, StackServiceVolumeTypeDto.LocalMount)]
    public void ShouldMapVolumeTypeDto(
        StackServiceVolumeType entityValue,
        StackServiceVolumeTypeDto dtoValue
    )
    {
        var dto = _mapper.Map<StackServiceVolumeTypeDto>(entityValue);

        dto.Should().Be(dtoValue);

        var entity = _mapper.Map<StackServiceVolumeType>(dto);
        entity.Should().Be(entityValue);
    }
}
