using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class BaseSourceProviderConfiguration : IEntityTypeConfiguration<BaseSourceProvider>
{
    public void Configure(EntityTypeBuilder<BaseSourceProvider> builder)
    {
        builder
            .ToTable("SourceProviders")
            .HasDiscriminator<int>("ProviderType")
            .HasValue<GithubProvider>(1);

        builder.HasKey(sp => sp.Id);
    }
}
