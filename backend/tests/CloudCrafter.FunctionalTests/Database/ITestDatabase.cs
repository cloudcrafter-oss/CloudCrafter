using System.Data.Common;

namespace CloudCrafter.FunctionalTests.Database;

public interface ITestDatabase
{
    Task InitialiseAsync();

    DbConnection GetConnection();

    Task ResetAsync();

    Task DisposeAsync();
}
