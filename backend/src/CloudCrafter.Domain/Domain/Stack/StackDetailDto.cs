﻿using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using AutoMapper;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Stack;

public class StackDetailDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    
    public List<StackServiceDto> Services { get; init; } = new();

    public required StackSourceDto? Source { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Stack, StackDetailDto>()
                .ForMember(x => x.Services, opt => opt.Ignore());
        }
    }
}

public class StackServiceDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required StackHealthStatus HealthStatus { get; init; }
}

public class StackSourceDto
{
    public required StackSourceType Type { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ApplicationSource, StackSourceDto>();
        }
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum StackHealthStatus
{
    Healthy,
    Degraded,
    Unhealthy,
    Unknown
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum StackSourceType
{
    Git,
    GitSsh,
}

