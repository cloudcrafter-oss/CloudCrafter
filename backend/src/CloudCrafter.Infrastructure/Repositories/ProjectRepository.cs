using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Project;
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
}
