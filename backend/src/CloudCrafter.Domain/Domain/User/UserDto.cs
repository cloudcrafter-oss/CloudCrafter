using AutoMapper;

namespace CloudCrafter.Domain.Domain.User;

public class UserDto
{
    public string Email { get; set; } = null!;  

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.User, UserDto>();
        }
    }
}
