using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using MediatR;

namespace CloudCrafter.Core.Commands.Projects;

public static class CreateProjectCommand
{
    public record Command(string Name) : IRequest<ProjectDto>;

    private class Handler(IProjectsService service) : IRequestHandler<Command, ProjectDto>
    {
        public Task<ProjectDto> Handle(Command request, CancellationToken cancellationToken)
        {
            return service.CreateProject(request.Name);
        }
    }
}
