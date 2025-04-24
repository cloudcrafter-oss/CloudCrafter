namespace CloudCrafter.Core.Common.Interfaces.Access;

public interface IRequireTeamAccess
{
    Guid? TeamId { get; set; }
}
