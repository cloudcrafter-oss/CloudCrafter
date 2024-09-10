using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stack;

public class StackSourceDto
{
    public required StackSourceDtoType Type { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ApplicationSource, StackSourceDto>();
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum StackSourceDtoType
{
    Git,
    GitSsh,
}
