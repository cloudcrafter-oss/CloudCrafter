using CloudCrafter.Domain.Domain.Teams;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public class GetMyTeamsCommand : IRequest<List<SimpleTeamDto>> { }
