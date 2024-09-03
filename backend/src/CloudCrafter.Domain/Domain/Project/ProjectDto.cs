using AutoMapper;
using CloudCrafter.Domain.Domain.Environments;

namespace CloudCrafter.Domain.Domain.Project;

public class ProjectDto
{
    public required Guid Id { get; init; }
    public required string Name { get; set; }
    public required string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }

    public List<EnvironmentDto> Environments { get; init; } = new();

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Project, ProjectDto>()
                .ForMember(x => x.Environments, opt => opt.ExplicitExpansion());
        }
    }
}
