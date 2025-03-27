﻿using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Commands.Projects;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class ProjectRepository(IApplicationDbContext dbContext, IMapper mapper) : IProjectRepository
{
    private IQueryable<Project> ProjectsQueryable => dbContext.Projects.OrderBy(x => x.CreatedAt);

    public async Task<List<ProjectDto>> GetProjects(LoadProjectOptions options)
    {
        var projects = ProjectsQueryable;

        if (options.IncludeEnvironments.GetValueOrDefault())
        {
            projects = projects.Include(x => x.Environments);
        }

        var projectList = await projects.ToListAsync();

        var result = mapper.Map<List<ProjectDto>>(projectList);

        return result;
    }

    public async Task<Project> CreateProject(string name)
    {
        var project = new Project
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Id = Guid.NewGuid(),
            Name = name,
            Description = null,
        };

        dbContext.Projects.Add(project);

        await dbContext.SaveChangesAsync();

        return project;
    }

    public Task<ProjectDto?> GetProject(Guid id)
    {
        return dbContext
            .Projects.ProjectTo<ProjectDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<ProjectDto> UpdateProject(Guid id, UpdateProjectArgs updateValues)
    {
        var project = await dbContext.Projects.FirstOrDefaultAsync(p => p.Id == id);

        if (project is null)
        {
            throw new Exception("Project not found");
        }

        var hasChanges = false;
        if (!string.IsNullOrWhiteSpace(updateValues.Name))
        {
            project.Name = updateValues.Name;
            hasChanges = true;
        }

        if (!string.IsNullOrWhiteSpace(updateValues.Description))
        {
            project.Description = updateValues.Description;
            hasChanges = true;
        }

        if (hasChanges)
        {
            project.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }

        return mapper.Map<ProjectDto>(project);
    }

    public async Task DeleteProject(Guid id)
    {
        var project = ProjectsQueryable.FirstOrDefault(p => p.Id == id);

        if (project is null)
        {
            throw new NotFoundException("Project", "Project not found");
        }

        dbContext.Projects.Remove(project);
        await dbContext.SaveChangesAsync();
    }
}
