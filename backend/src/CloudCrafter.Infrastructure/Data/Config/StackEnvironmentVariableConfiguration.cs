using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class StackEnvironmentVariableConfiguration
    : IEntityTypeConfiguration<StackEnvironmentVariable>
{
    public void Configure(EntityTypeBuilder<StackEnvironmentVariable> builder)
    {
        // Create unique constraint for Key + StackId combination
        builder
            .HasIndex(v => new { v.Key, v.StackId })
            .IsUnique()
            .HasDatabaseName("IX_StackEnvironmentVariable_Key_StackId");

        // Key configuration
        builder.Property(v => v.Key).IsRequired().HasMaxLength(100);

        // Value configuration
        builder.Property(v => v.Value).HasMaxLength(2000);

        // Configure relationship with Stack
        builder
            .HasOne(v => v.Stack)
            .WithMany(s => s.EnvironmentVariables)
            .HasForeignKey(v => v.StackId)
            .IsRequired();

        builder
            .HasOne(x => x.Group)
            .WithMany(x => x.EnvironmentVariables)
            .HasForeignKey(x => x.GroupId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
