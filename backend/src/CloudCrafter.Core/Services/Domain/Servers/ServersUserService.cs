using AutoMapper;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServersUserService(
    IServerRepository repository,
    IMapper mapper,
    IUser user,
    IUserAccessService accessService
) : ServersService(repository, mapper)
{
    private readonly IServerRepository _repository = repository;

    public override async Task DeleteServer(Guid id)
    {
        var server = await _repository.GetServerEntityOrFail(id);
        await accessService.EnsureCanMutateEntity(server, user.Id);

        await base.DeleteServer(id);
    }
}
