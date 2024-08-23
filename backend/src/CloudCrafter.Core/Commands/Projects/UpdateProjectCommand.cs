using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class UpdateProjectCommand
{
    public record Command(Guid Id, UpdateProjectPatchArgs PatchArgs) : IRequest<ProjectDto>;
}

public class UpdateProjectPatchArgs
{
    public string? Name { get; init; }
}
