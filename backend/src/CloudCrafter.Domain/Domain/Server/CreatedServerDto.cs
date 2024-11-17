using AutoMapper;

namespace CloudCrafter.Domain.Domain.Server;

public class CreatedServerDto
{
    public required Guid Id { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Server, CreatedServerDto>();
        }
    }
}
