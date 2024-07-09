using System.Text;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Modes;
using Org.BouncyCastle.Crypto.Paddings;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;

namespace EntityFrameworkCore.EncryptColumn.Util;

public static class Helper
{
    public static string EncryptString(string plainText, string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key.PadRight(32));
        var ivBytes = GenerateRandomBytes(16);

        var cipher = new PaddedBufferedBlockCipher(new CbcBlockCipher(new AesEngine()));
        cipher.Init(true, new ParametersWithIV(new KeyParameter(keyBytes), ivBytes));

        var inputBytes = Encoding.UTF8.GetBytes(plainText);
        var outputBytes = new byte[cipher.GetOutputSize(inputBytes.Length)];
        var length = cipher.ProcessBytes(inputBytes, 0, inputBytes.Length, outputBytes, 0);
        cipher.DoFinal(outputBytes, length);

        var resultBytes = new byte[ivBytes.Length + outputBytes.Length];
        Array.Copy(ivBytes, 0, resultBytes, 0, ivBytes.Length);
        Array.Copy(outputBytes, 0, resultBytes, ivBytes.Length, outputBytes.Length);

        return Convert.ToBase64String(resultBytes);
    }

    public static string DecryptString(string cipherText, string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key.PadRight(32));
        var fullCipherBytes = Convert.FromBase64String(cipherText);

        var ivBytes = new byte[16];
        var cipherBytes = new byte[fullCipherBytes.Length - ivBytes.Length];

        Array.Copy(fullCipherBytes, 0, ivBytes, 0, ivBytes.Length);
        Array.Copy(fullCipherBytes, ivBytes.Length, cipherBytes, 0, cipherBytes.Length);

        var cipher = new PaddedBufferedBlockCipher(new CbcBlockCipher(new AesEngine()));
        cipher.Init(false, new ParametersWithIV(new KeyParameter(keyBytes), ivBytes));

        var outputBytes = new byte[cipher.GetOutputSize(cipherBytes.Length)];
        var length = cipher.ProcessBytes(cipherBytes, 0, cipherBytes.Length, outputBytes, 0);
        cipher.DoFinal(outputBytes, length);

        return Encoding.UTF8.GetString(outputBytes).TrimEnd('\0');
    }

    private static byte[] GenerateRandomBytes(int length)
    {
        var random = new SecureRandom();
        var bytes = new byte[length];
        random.NextBytes(bytes);
        return bytes;
    }
}
