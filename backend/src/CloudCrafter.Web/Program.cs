using System.Reflection;
using CloudCrafter.Core;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Core.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Email;
using CloudCrafter.Infrastructure.Repositories;
using CloudCrafter.Web.Infrastructure;
using CloudCrafter.Web.Infrastructure.Services;
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


builder.Services.AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .AddApplicationServices()
    .AddAutoMapper(Assembly.GetExecutingAssembly())
    .AddInfrastructureServices(builder.Configuration, microsoftLogger)
    .AddCloudCrafterIdentity(builder.Configuration)
    .AddCloudCrafterConfiguration(builder.Configuration)
    .AddWebConfig(builder.Configuration);



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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}


app.UseHttpsRedirection();
app.SeedDatabase();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.UseCors("DefaultCorsPolicy");

app.MapEndpoints();

app.Run();

// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program
{
}
