using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record UpdateStackEnvironmentVariableGroupCommand
    : CreateStackEnvironmentVariableGroupBaseCommand,
        IRequest
{
    [JsonIgnore]
    public Guid Id { get; set; }
}

public class UpdateStackEnvironmentVariableGroupCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<UpdateStackEnvironmentVariableGroupCommand>
{
    public async Task Handle(
        UpdateStackEnvironmentVariableGroupCommand request,
        CancellationToken cancellationToken
    )
    {
        await environmentVariablesService.UpdateEnvironmentVariableGroup(
            request.Id,
            request.StackId,
            request.Name,
            request.Description
        );
    }
}
