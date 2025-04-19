using AutoMapper;

namespace CloudCrafter.Domain.Domain.Teams;

public class SimpleTeamDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Team, SimpleTeamDto>();
        }
    }
}
