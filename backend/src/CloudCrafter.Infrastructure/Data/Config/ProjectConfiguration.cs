using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasOne(x => x.Team).WithMany(x => x.Projects).OnDelete(DeleteBehavior.Restrict);
    }
}
