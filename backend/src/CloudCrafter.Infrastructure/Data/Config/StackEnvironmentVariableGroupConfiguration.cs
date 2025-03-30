using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class StackEnvironmentVariableGroupConfiguration
    : IEntityTypeConfiguration<StackEnvironmentVariableGroup>
{
    public void Configure(EntityTypeBuilder<StackEnvironmentVariableGroup> builder)
    {
        // Create unique constraint for Key + StackId combination
        builder
            .HasIndex(v => new { v.Name, v.StackId })
            .IsUnique()
            .HasDatabaseName("IX_StackEnvironmentVariableGroup_Name_StackId");

        // Configure relationship with Stack
        builder
            .HasOne(v => v.Stack)
            .WithMany(s => s.EnvironmentVariableGroups)
            .HasForeignKey(v => v.StackId)
            .IsRequired();
    }
}
