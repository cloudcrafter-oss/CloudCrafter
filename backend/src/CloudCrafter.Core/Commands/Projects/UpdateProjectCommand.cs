using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record UpdateProjectCommand(Guid Id, UpdateProjectArgs Args) : IRequest<ProjectDto>;

public class UpdateProjectCommandHandler(IProjectsService service)
    : IRequestHandler<UpdateProjectCommand, ProjectDto>
{
    public Task<ProjectDto> Handle(
        UpdateProjectCommand request,
        CancellationToken cancellationToken
    )
    {
        return service.UpdateProject(request.Id, request.Args);
    }
}

public class UpdateProjectArgs
{
    public string? Name { get; init; }
    public string? Description { get; init; }
}
