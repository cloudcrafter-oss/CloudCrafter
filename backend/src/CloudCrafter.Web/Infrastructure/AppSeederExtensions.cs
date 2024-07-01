using CloudCrafter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Web.Infrastructure;

public static class AppSeederExtensions
{
    public static WebApplication SeedDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;

        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            context.Database.Migrate();
            // context.Database.EnsureCreated();
            SeedData.Initialize(services);
            SeedData.InitializeIdentity(services);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred seeding the DB. {exceptionMessage}", ex.Message);
        }
        return app;
    }
}
