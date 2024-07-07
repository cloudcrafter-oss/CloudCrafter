using AutoMapper;

namespace CloudCrafter.Domain.Domain.Project;

public class ProjectDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Project, ProjectDto>();
        }
    }
}
