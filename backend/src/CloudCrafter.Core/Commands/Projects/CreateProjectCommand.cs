using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record CreateProjectCommand(string Name) : IRequest<ProjectDto>;

internal class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    private readonly IProjectsService _service;

    public CreateProjectCommandHandler(IProjectsService service)
    {
        _service = service;
    }

    public Task<ProjectDto> Handle(
        CreateProjectCommand request,
        CancellationToken cancellationToken
    )
    {
        return _service.CreateProject(request.Name);
    }
}
