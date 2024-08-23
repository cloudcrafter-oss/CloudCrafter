namespace CloudCrafter.Domain.Interfaces;

public interface IHasTimestamps
{
    DateTime CreatedAt { get; init; }
    DateTime UpdatedAt { get; set; }
}
