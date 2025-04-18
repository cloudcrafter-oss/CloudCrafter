namespace CloudCrafter.Core.Interfaces.Repositories;

public interface ITeamsRepository
{
    Task<Guid> CreateTeam(string name);
    Task DeleteTeam(Guid teamId);
    Task UpdateTeamName(Guid teamId, string name);
}
