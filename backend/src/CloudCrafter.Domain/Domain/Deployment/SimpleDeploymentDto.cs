﻿using AutoMapper;

namespace CloudCrafter.Domain.Domain.Deployment;

public class SimpleDeploymentDto
{
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }

    public required Guid Id { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Entities.Deployment, SimpleDeploymentDto>();
        }
    }
}
