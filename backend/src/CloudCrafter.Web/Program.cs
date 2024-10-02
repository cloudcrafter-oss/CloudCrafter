using CloudCrafter.Core;
using CloudCrafter.Core.Events;
using CloudCrafter.Core.SignalR;
using CloudCrafter.DeploymentEngine.Remote;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Logging;
using CloudCrafter.Jobs.Service;
using CloudCrafter.Web;
using CloudCrafter.Web.Infrastructure;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.Extensions.Options;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = LoggingConfiguration.GetLogger();

Log.Information("Starting CloudCrafter");

builder.Services.AddApiConfiguration(builder.Configuration);
builder.Services.AddCloudCrafterCors(builder.Configuration);
builder.Services.AddEngineInfrastructure();
builder.Services.AddCloudCrafterLogging(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddDomainEvents(typeof(IDomainEvent).Assembly);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebServices(builder.Configuration);
builder.Services.AddSwaggerServices();
builder.Services.AddJobInfrastructure(builder.Configuration, true, JobServiceType.Web);

var app = builder.Build();

var validator = app.Services.GetRequiredService<IStartupValidator>();
validator.Validate();

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

app.MapControllerRoute("default", "{controller}/{action=Index}/{id?}");

app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.UseExceptionHandler(options => { });

app.Map("/", () => Results.Redirect("/api"));

app.MapEndpoints();
app.SeedDatabase();
app.UseCors("CloudCrafterCorsPolicy");

var hangfireDashboardOptions = new DashboardOptions();

if (app.Environment.IsDevelopment())
{
    hangfireDashboardOptions.Authorization = new List<IDashboardAuthorizationFilter>();
}

app.UseHangfireDashboard(options: hangfireDashboardOptions);

app.ConfigureRecurringJobs();

app.MapHub<MyHub>("/myHub");
app.MapHub<AgentHub>("/hub/agent");
app.Run();

// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program { }
