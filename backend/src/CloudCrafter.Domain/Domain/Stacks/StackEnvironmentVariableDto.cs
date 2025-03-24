using AutoMapper;
using CloudCrafter.Domain.Common.AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stacks;

public class StackEnvironmentVariableDto
{
    public required Guid Id { get; init; }
    public required Guid StackId { get; init; }
    public required Guid? GroupId { get; init; }
    public required string Key { get; init; }
    public required string Value { get; init; }
    public required bool IsSecret { get; init; }
    public required EnvironmentVariableType Type { get; init; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? LastModifiedAt { get; init; }
    public string? GroupName { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<StackEnvironmentVariable, StackEnvironmentVariableDto>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom<SecretValueResolver>());
        }
    }
}
