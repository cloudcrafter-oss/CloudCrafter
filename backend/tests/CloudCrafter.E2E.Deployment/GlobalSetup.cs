// using System.Diagnostics;
// using CloudCrafter.TestUtilities;
// using DotNet.Testcontainers.Builders;
// using DotNet.Testcontainers.Images;
// using Microsoft.Extensions.Logging;
//
// namespace CloudCrafter.E2E.Deployment;
//
// [SetUpFixture]
// public class GlobalSetup : SharedDockerTestHostSetup
// {
//     protected IFutureDockerImage AgentImage { get; set; }
//
//     [OneTimeSetUp]
//     public async Task SetupE2ETests()
//     {
//         //    await base.Setup();
//
//         var solutionDirectory = GetSolutionDirectory();
//
//         AgentImage = new ImageFromDockerfileBuilder()
//             .WithDockerfileDirectory(solutionDirectory)
//             .WithName("cloudcrafter-e2e-agent:latest")
//             .WithDockerfile("src/CloudCrafter.Agent.Console/Dockerfile")
//             .Build();
//
//         await AgentImage.CreateAsync();
//     }
//
//     [OneTimeTearDown]
//     public async Task TearDownE2ETests()
//     {
//         //await base.GlobalTeardown();
//
//         await AgentImage.DisposeAsync();
//     }
// }
