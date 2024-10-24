﻿using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IStackRepository
{
    Task<Stack> CreateStack(CreateStackArgsDto args);
    Task<Stack?> GetStack(Guid id);
    Task AddAppServiceToStack(Guid stackId, string name);

    Task<Guid> CreateDeployment(Guid stackId);
    Task<List<Deployment>> GetDeployments(Guid stackId);
}
