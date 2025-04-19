﻿using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IProjectRepository
{
    Task<List<ProjectDto>> GetProjects(LoadProjectOptions options);
    Task<Project> CreateProject(string name, Guid teamId);
    Task<ProjectDto?> GetProject(Guid id);
    Task<ProjectDto> UpdateProject(Guid id, UpdateProjectArgs updateValues);
    Task DeleteProject(Guid id);
}
