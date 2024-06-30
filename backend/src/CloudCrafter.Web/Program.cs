using System.Reflection;
using Ardalis.ListStartupServices;
using Ardalis.SharedKernel;
using CloudCrafter.Core;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Core.Interfaces;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Email;
using CloudCrafter.Infrastructure.Identity;
using CloudCrafter.UseCases.Contributors.Create;
using CloudCrafter.Web.Infrastructure;
using CloudCrafter.Web.Infrastructure.Services;
using FastEndpoints;
using FastEndpoints.Swagger;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Extensions.Logging;

var logger = Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

logger.Information("Starting web host");

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((_, config) => config.ReadFrom.Configuration(builder.Configuration));
var microsoftLogger = new SerilogLoggerFactory(logger)
    .CreateLogger<Program>();

// Configure Web Behavior
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});




builder.Services.AddFastEndpoints()
    .SwaggerDocument(o =>
    {
        o.ShortSchemaNames = true;
    });

ConfigureMediatR();
ConfigureAutoMapper();

builder.Services.AddInfrastructureServices(builder.Configuration, microsoftLogger)
    .AddCloudCrafterIdentity(builder.Configuration)
    .AddCloudCrafterConfiguration(builder.Configuration);

builder.Services.AddCors(options =>
{
    var corsSettings = new CorsSettings();
    builder.Configuration.Bind(CorsSettings.KEY, corsSettings);
    
    options.AddPolicy("DefaultCorsPolicy", corsBuilder =>
    {
        corsBuilder.WithOrigins(corsSettings.AllowedOrigins.ToArray())
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddExceptionHandler<CustomExceptionHandler>();
builder.Services.AddScoped<IUser, CurrentUser>();
if (builder.Environment.IsDevelopment())
{
    // Use a local test email server
    // See: https://ardalis.com/configuring-a-local-test-email-server/
    builder.Services.AddScoped<IEmailSender, MimeKitEmailSender>();

    // Otherwise use this:
    //builder.Services.AddScoped<IEmailSender, FakeEmailSender>();
    AddShowAllServicesSupport();
}
else
{
    builder.Services.AddScoped<IEmailSender, MimeKitEmailSender>();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // app.UseDeveloperExceptionPage();
    // app.UseShowAllServicesMiddleware(); // see https://github.com/ardalis/AspNetCoreStartupServices
}
else
{
    //  app.UseDefaultExceptionHandler(); // from FastEndpoints
    app.UseHsts();
}


app.UseFastEndpoints()
    .UseSwaggerGen(); // Includes AddFileServer and static files middleware

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler(options => { });
SeedAppDatabase(app);

app.MapEndpoints();
app.UseCors("DefaultCorsPolicy");

app.Run();

static void SeedAppDatabase(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        // context.Database.EnsureCreated();
        SeedData.Initialize(services);

        var identityContext = services.GetRequiredService<AppIdentityDbContext>();
        identityContext.Database.Migrate();
        SeedData.InitializeIdentity(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB. {exceptionMessage}", ex.Message);
    }
}

void ConfigureMediatR()
{
    builder.Services.AddApplicationServices();
}

void ConfigureAutoMapper()
{
    builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
}

void AddShowAllServicesSupport()
{
    // add list services for diagnostic purposes - see https://github.com/ardalis/AspNetCoreStartupServices
    builder.Services.Configure<ServiceConfig>(config =>
    {
        config.Services = new List<ServiceDescriptor>(builder.Services);

        // optional - default path to view services is /listallservices - recommended to choose your own path
        config.Path = "/listservices";
    });
}

// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program
{
}
