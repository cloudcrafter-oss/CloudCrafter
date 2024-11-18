namespace CloudCrafter.Core.Interfaces.Domain.Stacks.Filters;

public class DeploymentsFilter
{
    public Guid? StackId { get; init; }
    public Guid? ServerId { get; init; }
}
