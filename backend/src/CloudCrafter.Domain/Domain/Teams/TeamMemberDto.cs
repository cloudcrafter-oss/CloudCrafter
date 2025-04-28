using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Teams;

public class TeamMemberDto
{
    public required Guid Id { get; init; }
    public required string? Email { get; init; }
    public required string? FullName { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<TeamUser, TeamMemberDto>()
                .ForMember(x => x.Id, f => f.MapFrom(x => x.UserId))
                .ForMember(x => x.Email, f => f.MapFrom(x => x.User.Email))
                .ForMember(x => x.FullName, f => f.MapFrom(x => x.User.FullName));
        }
    }
}
