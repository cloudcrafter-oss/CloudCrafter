using CloudCrafter.Domain.Domain.Stacks;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

public record GetStackEnvironmentVariablesQuery(
    Guid StackId,
    bool IncludeInherited = false,
    bool IncludeSecrets = false
) : IRequest<List<StackEnvironmentVariableDto>>;
