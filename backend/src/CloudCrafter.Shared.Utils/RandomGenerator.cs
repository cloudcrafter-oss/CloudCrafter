namespace CloudCrafter.Shared.Utils;

public static class RandomGenerator
{
    public static string String()
    {
        var random = new Random();
        var randomString = new string(
            Enumerable
                .Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
                .Select(s => s[random.Next(s.Length)])
                .ToArray()
        );

        return randomString;
    }
}
