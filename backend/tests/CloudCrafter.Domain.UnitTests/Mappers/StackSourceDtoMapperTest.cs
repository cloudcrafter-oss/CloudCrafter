using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public class StackSourceDtoMapperTest : BaseMapperTest
{
    [Test]
    [TestCase(ApplicationSourceType.Git, StackSourceDtoType.Git)]
    [TestCase(ApplicationSourceType.GitSsh, StackSourceDtoType.GitSsh)]
    public void ShouldBeAbleToMapStackSourceDto(
        ApplicationSourceType type,
        StackSourceDtoType dtoType
    )
    {
        var entity = new ApplicationSource { Type = type };

        var dto = _mapper.Map<StackSourceDto>(entity);

        dto.Type.Should().Be(dtoType);
    }
}
