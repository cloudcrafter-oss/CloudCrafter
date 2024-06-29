namespace CloudCrafter.FunctionalTests.Database;

public static class TestDatabaseFactory
{
    public static async Task<ITestDatabase> CreateAsync()
    {
#if DEBUG
        var database = new TestContainersTestDatabase();
#else
        var database = new TestContainersTestDatabase();
#endif

        await database.InitialiseAsync();

        return database;
    }
}
