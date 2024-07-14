using CloudCrafter.FunctionalTests.Database.Dev;
using CloudCrafter.FunctionalTests.Database.Testcontainers;

namespace CloudCrafter.FunctionalTests.Database;

public static class TestDatabaseFactory
{
    public static async Task<ITestDatabase> CreateAsync()
    {
        var useLocalTestDatabase = Environment.GetEnvironmentVariable("USE_LOCAL_TEST_DATABASE") == "true";

        ITestDatabase database;

        if (!useLocalTestDatabase)
        {
            database = new TestContainersTestDatabase();
        }
        else
        {
            database = new DevelopmentTestDatabase();
        }

        await database.InitialiseAsync();

        return database;
    }
}
