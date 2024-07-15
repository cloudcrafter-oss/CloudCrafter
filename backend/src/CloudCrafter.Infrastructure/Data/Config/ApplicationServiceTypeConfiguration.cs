using CloudCrafter.Domain.Domain.Application.Services;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CloudCrafter.Infrastructure.Data.Config;

public class ApplicationServiceTypeConfiguration : IEntityTypeConfiguration<ApplicationServiceType>
{
    public void Configure(EntityTypeBuilder<ApplicationServiceType> builder)
    {
        builder.HasData(new List<ApplicationServiceType>()
        {
            new ApplicationServiceType()
            {
                Id = ApplicationServiceTypeConstants.AppType,
                Type = nameof(ApplicationServiceTypeConstants.AppType)
            }
        });
    }
}
