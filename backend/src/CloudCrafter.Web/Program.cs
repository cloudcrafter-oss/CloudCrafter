using CloudCrafter.Core;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Logging;
using CloudCrafter.Jobs.Actions;
using CloudCrafter.Jobs.Infrastructure;
using CloudCrafter.Web;
using CloudCrafter.Web.Infrastructure;
using Hangfire;
using Serilog;

var builder = WebApplication.CreateBuilder(args);


Log.Logger = LoggingConfiguration.GetLogger();

Log.Information("Starting CloudCrafter");

builder.Services.AddCloudCrafterLogging(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration)
    .AddApiConfiguration(builder.Configuration);
builder.Services.AddWebServices();
builder.Services.AddSwaggerServices();
builder.Services.AddJobInfrastructure(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    await app.InitialiseDatabaseAsync();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.MapControllerRoute(
    "default",
    "{controller}/{action=Index}/{id?}");

app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.UseExceptionHandler(options => { });

app.Map("/", () => Results.Redirect("/api"));

app.MapEndpoints();
app.SeedDatabase();

app.UseHangfireDashboard();



app.Run();


// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program
{
}
