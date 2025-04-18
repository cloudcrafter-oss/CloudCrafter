﻿using CloudCrafter.Domain.Common;

namespace CloudCrafter.Domain.Entities;

public class Team : BaseAuditableEntity
{
    public required string Name { get; set; }

    public required Guid OwnerId { get; set; }

    public virtual User Owner { get; set; } = null!;

    public List<User> Users { get; set; } = new List<User>();
}
