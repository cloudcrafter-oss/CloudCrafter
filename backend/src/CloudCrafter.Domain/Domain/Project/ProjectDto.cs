using AutoMapper;

namespace CloudCrafter.Domain.Domain.Project;

public class ProjectDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Project, ProjectDto>();
        }
    }
}
