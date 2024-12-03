using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Server;

public class ServerDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string IpAddress { get; set; }

    public required ServerPingDto PingData { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Server, ServerDto>()
                .ForMember(x => x.PingData, opt => opt.MapFrom(src => src.PingHealthData));
        }
    }
}

public class ServerPingDto
{
    public DateTime? LastPingReceivedAt { get; set; }

    public string? OsInfo { get; set; }
    public string? DockerVersion { get; set; }

    public double? CpuUsagePercentage { get; set; }
    public int? TotalCpuCount { get; set; }
    public double? MemoryUsagePercentage { get; set; }
    public long? TotalMemoryBytes { get; set; }
    public ServerStatusDtoValue Status { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.ServerPingData, ServerPingDto>()
                .ForMember(x => x.LastPingReceivedAt, opt => opt.MapFrom(src => src.LastPingAt));
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ServerStatusDtoValue
{
    Unknown,
    Connected,
    Disconnected,
}
