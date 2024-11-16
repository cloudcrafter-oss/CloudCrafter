namespace CloudCrafter.Core.Utils;

public static class StringUtils
{
    public static string GenerateSecret(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return new string(
            Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray()
        );
    }
}
