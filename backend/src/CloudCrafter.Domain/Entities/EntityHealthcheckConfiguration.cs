namespace CloudCrafter.Domain.Entities;

public class EntityHealthcheckConfiguration
{
    public string? HttpMethod { get; set; } = "GET";
    public string? HttpSchema { get; set; } = "http";
    public string? HttpHost { get; set; } = "127.0.0.1";
    public string? HttpPath { get; set; } = "/";
    public int? HttpPort { get; set; } = 80;
    public int? ExpectedHttpStatusCode { get; set; } = 200;
    public int? MaxRetries { get; set; } = 3;
}
