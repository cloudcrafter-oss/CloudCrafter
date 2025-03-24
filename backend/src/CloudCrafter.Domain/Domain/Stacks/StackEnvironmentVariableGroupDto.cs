using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stacks;

public class StackEnvironmentVariableGroupDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<StackEnvironmentVariableGroup, StackEnvironmentVariableGroupDto>();
        }
    }
}
