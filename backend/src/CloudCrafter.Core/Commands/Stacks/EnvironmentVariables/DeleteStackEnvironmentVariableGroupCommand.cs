using CloudCrafter.Core.Common.Security;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;

[Authorize]
public record DeleteStackEnvironmentVariableGroupCommand(Guid StackId, Guid Id) : IRequest<bool>;
