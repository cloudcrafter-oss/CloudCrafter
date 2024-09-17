namespace CloudCrafter.Domain.Entities;

public class EntityHttpConfiguration
{
    public required string? DomainName { get; set; }
    public required int? ContainerHttpPort { get; set; }
}
