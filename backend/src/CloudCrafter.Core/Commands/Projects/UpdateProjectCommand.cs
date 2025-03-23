using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record UpdateProjectCommand(Guid Id, UpdateProjectArgs Args) : IRequest<ProjectDto>;

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, ProjectDto>
{
    private readonly IProjectsService _service;

    public UpdateProjectCommandHandler(IProjectsService service)
    {
        _service = service;
    }

    public Task<ProjectDto> Handle(
        UpdateProjectCommand request,
        CancellationToken cancellationToken
    )
    {
        return _service.UpdateProject(request.Id, request.Args);
    }
}

public class UpdateProjectArgs
{
    public string? Name { get; init; }
    public string? Description { get; init; }
}
