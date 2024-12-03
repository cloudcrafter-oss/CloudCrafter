using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public class ServerPingDtoMapperTest : BaseMapperTest
{
    [Test]
    [TestCase(ServerStatusValue.Unknown, ServerStatusDtoValue.Unknown)]
    [TestCase(ServerStatusValue.Connected, ServerStatusDtoValue.Connected)]
    [TestCase(ServerStatusValue.Disconnected, ServerStatusDtoValue.Disconnected)]
    public void ShouldMapServerPingData(
        ServerStatusValue entityValue,
        ServerStatusDtoValue dtoValue
    )
    {
        var pingData = new ServerPingData() { Status = entityValue };

        var serverPingDto = _mapper.Map<ServerPingDto>(pingData);

        serverPingDto.Status.Should().Be(dtoValue);
    }
}
