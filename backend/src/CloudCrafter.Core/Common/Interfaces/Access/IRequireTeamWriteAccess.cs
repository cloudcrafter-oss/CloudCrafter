namespace CloudCrafter.Core.Common.Interfaces.Access;

public interface IRequireTeamWriteAccess
{
    Guid? TeamId { get; set; }
}
