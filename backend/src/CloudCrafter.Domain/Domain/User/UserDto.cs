using AutoMapper;
using CloudCrafter.Domain.Common.Filtering;

namespace CloudCrafter.Domain.Domain.User;

public class UserDto : IFilterableDto
{
    public Guid Id { get; init; }
    [Filterable]
    public string Email { get; init; } = null!;
    public DateTime CreatedAt { get; init; }
    [Filterable]
    public string FullName { get; init; } = null!;

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.User, UserDto>();
        }
    }
}
