using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

[Authorize]
public record CreateProjectCommand(string Name, Guid TeamId) : IRequest<ProjectDto> { }

internal class CreateProjectCommandHandler(IProjectsService service)
    : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    public Task<ProjectDto> Handle(
        CreateProjectCommand request,
        CancellationToken cancellationToken
    )
    {
        return service.CreateProject(request.Name, request.TeamId);
    }
}
