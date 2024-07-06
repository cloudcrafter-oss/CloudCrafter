namespace CloudCrafter.Domain.Common.Filtering;

public class FilterCriterea
{
    public required string PropertyName { get; set; }
    public required string Operator { get; set; }
    public string? Value { get; set; }
}
