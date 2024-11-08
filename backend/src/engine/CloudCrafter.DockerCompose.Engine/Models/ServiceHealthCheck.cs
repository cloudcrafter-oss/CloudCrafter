namespace CloudCrafter.DockerCompose.Engine.Models;

public class ServiceHealthCheck
{
    public required string Test { get; set; }
    public required int? IntervalSeconds { get; set; } //= "30s";
    public required int? TimeoutSeconds { get; set; } //= "10s";
    public required int? Retries { get; set; } // = 3;
    public required int? StartPeriodSeconds { get; set; } // = "40s";
}
