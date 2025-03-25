using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record UpdateStackEnvironmentVariableCommand
    : CreateStackEnvironmentVariableCommand,
        IRequest<Guid>
{
    [JsonIgnore]
    public Guid Id { get; set; }
}

public class UpdateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<UpdateStackEnvironmentVariableCommand, Guid>
{
    public async Task<Guid> Handle(
        UpdateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        var result = await environmentVariablesService.UpdateEnvironmentVariable(
            request.Id,
            request.StackId,
            request.Key,
            request.Value,
            request.IsSecret,
            request.Type
        );

        return result;
    }
}
