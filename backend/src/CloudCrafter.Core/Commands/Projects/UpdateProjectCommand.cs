using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class UpdateProjectCommand
{
    public record Command(Guid Id, UpdateProjectArgs Args) : IRequest<ProjectDto>;

    public class Handler(IProjectsService service) : IRequestHandler<Command, ProjectDto>
    {
        public Task<ProjectDto> Handle(Command request, CancellationToken cancellationToken)
        {
            return service.UpdateProject(request.Id, request.Args);
        }
    }
}

public class UpdateProjectArgs
{
    public string? Name { get; init; }
    public string? Description { get; init; }
}
