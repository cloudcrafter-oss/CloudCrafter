namespace CloudCrafter.Core.Commands.Applications;

// TODO: Write Architecute Test to make sure that each command has an ApplicationId so we can filter
// on it in a behavior
public interface IApplicationCommand
{
    Guid ApplicationId { get; init; }
}
