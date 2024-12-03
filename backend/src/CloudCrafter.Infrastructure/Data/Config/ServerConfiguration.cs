using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class ServerConfiguration : IEntityTypeConfiguration<Server>
{
    public void Configure(EntityTypeBuilder<Server> builder)
    {
        builder.OwnsOne(x => x.PingHealthData);

        builder
            .HasMany(s => s.Stacks)
            .WithOne(st => st.Server)
            .HasForeignKey(st => st.ServerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
