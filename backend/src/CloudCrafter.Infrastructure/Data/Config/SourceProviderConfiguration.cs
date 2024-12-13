using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class SourceProviderConfiguration : IEntityTypeConfiguration<SourceProvider>
{
    public void Configure(EntityTypeBuilder<SourceProvider> builder)
    {
        builder
            .HasOne(sp => sp.GithubProvider)
            .WithOne(gp => gp.SourceProvider)
            .HasForeignKey<GithubProvider>(gp => gp.SourceProviderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
