using AutoMapper;

namespace CloudCrafter.Domain.Domain.User;

public class UserDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = null!;
    public DateTime CreatedAt { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.User, UserDto>();
        }
    }
}
