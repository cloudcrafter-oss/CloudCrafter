﻿namespace CloudCrafter.Core.Jobs.Dispatcher;

public interface ICloudCrafterDispatcher
{
    Task EnqueueConnectivityChecks();
    Task<string> EnqueueStackDeployment(Guid deploymentId);
    void DispatchJob(ISimpleJob job, string? hashId = null);
}
