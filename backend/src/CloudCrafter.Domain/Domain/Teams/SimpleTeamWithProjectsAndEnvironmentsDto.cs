using AutoMapper;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Teams;

public class SimpleTeamWithProjectsAndEnvironmentsDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }

    public List<ProjectDto> Projects { get; init; } = new();

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Team, SimpleTeamWithProjectsAndEnvironmentsDto>();
        }
    }
}
