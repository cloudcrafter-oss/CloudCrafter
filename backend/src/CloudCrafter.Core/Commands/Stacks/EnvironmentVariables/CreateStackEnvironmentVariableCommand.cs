using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Entities;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record CreateStackEnvironmentVariableCommand : IRequest<Guid>
{
    [JsonIgnore]
    public Guid StackId { get; set; }

    public required string Key { get; init; }
    public required string Value { get; init; }
    public required EnvironmentVariableType Type { get; init; }
    public required bool IsSecret { get; init; }
    public Guid? GroupId { get; init; }
}

public class CreateStackEnvironmentVariableCommandHandler(
    IStackEnvironmentVariablesService environmentVariablesService
) : IRequestHandler<CreateStackEnvironmentVariableCommand, Guid>
{
    public async Task<Guid> Handle(
        CreateStackEnvironmentVariableCommand request,
        CancellationToken cancellationToken
    )
    {
        var id = await environmentVariablesService.CreateEnvironmentVariable(
            request.StackId,
            request.Key,
            request.Value,
            request.IsSecret,
            request.Type,
            request.GroupId
        );

        return id;
    }
}
