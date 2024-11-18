using AutoMapper;

namespace CloudCrafter.Domain.Domain.Deployment;

public class SimpleDeploymentDto
{
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }

    public required Guid Id { get; init; }
    public required DeploymentStatusDto State { get; init; }

    public required Guid StackId { get; init; }
    public required string StackName { get; init; }

    public string Description => "Manual Deployment";

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Deployment, SimpleDeploymentDto>()
                .ForMember(x => x.StackName, opt => opt.MapFrom(src => src.Stack!.Name));
        }
    }
}
