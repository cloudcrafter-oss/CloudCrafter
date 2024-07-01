using System.Reflection;
using Ardalis.ListStartupServices;
using CloudCrafter.Core;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Core.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Requests.Filtering;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Email;
using CloudCrafter.Infrastructure.Identity;
using CloudCrafter.Infrastructure.Repositories;
using CloudCrafter.Web.Infrastructure;
using CloudCrafter.Web.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NSwag;
using NSwag.Generation.Processors.Security;
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

ConfigureMediatR();
ConfigureAutoMapper();

var nswagGeneratorRunning = Environment.GetEnvironmentVariable("CLOUDCRAFTER_RUN_NSWAG") == "true";


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
}
else
{
    builder.Services.AddScoped<IEmailSender, MimeKitEmailSender>();
}
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument((configure, sp) =>
{
    configure.Title = "CloudCrafter API";
    // Add JWT
    configure.AddSecurity("JWT", Enumerable.Empty<string>(),
        new OpenApiSecurityScheme
        {
            Type = OpenApiSecuritySchemeType.ApiKey,
            Name = "Authorization",
            In = OpenApiSecurityApiKeyLocation.Header,
            Description = "Type into the textbox: Bearer {your JWT token}."
        });

    configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
});


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


app.UseHttpsRedirection();


app.UseExceptionHandler(options => { });

if (!nswagGeneratorRunning)
{
    SeedAppDatabase(app);
}
app.UseSwaggerUi(settings =>
{
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.UseStaticFiles();
app.MapEndpoints();



app.UseAuthentication();
app.UseAuthorization();

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
    var mediatRAssemblies = new[]
    {
        Assembly.GetAssembly(typeof(Contributor)), // Core
    };
    builder.Services.AddApplicationServices(mediatRAssemblies);
}

void ConfigureAutoMapper()
{
    builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
}


// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program
{
}
