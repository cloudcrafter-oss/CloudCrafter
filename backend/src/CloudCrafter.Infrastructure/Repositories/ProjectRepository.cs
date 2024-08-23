using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Project;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class ProjectRepository(IApplicationDbContext dbContext, IMapper mapper) : IProjectRepository
{
    public Task<List<ProjectDto>> GetProjects()
    {
        return dbContext.Projects
            .ProjectTo<ProjectDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<ProjectDto> CreateProject(string name)
    {
        var project = new Project
        {
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, Id = Guid.NewGuid(), Name = name, Description = null
        };

        dbContext.Projects.Add(project);

        await dbContext.SaveChangesAsync();

        return mapper.Map<ProjectDto>(project);
    }
}
