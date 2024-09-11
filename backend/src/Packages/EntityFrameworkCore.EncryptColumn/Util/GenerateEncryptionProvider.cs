using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using EntityFrameworkCore.EncryptColumn.Interfaces;

namespace EntityFrameworkCore.EncryptColumn.Util;

public class GenerateEncryptionProvider(string Key) : IEncryptionProvider
{
    public string Encrypt(string dataToEncrypt)
    {
        if (string.IsNullOrEmpty(Key))
            throw new ArgumentNullException(
                "EncryptionKey",
                "Please initialize your encryption key."
            );

        if (string.IsNullOrEmpty(dataToEncrypt))
            return string.Empty;

        return Helper.EncryptString(dataToEncrypt, Key);
    }

    public string Decrypt(string dataToDecrypt)
    {
        if (string.IsNullOrEmpty(Key))
            throw new ArgumentNullException(
                "EncryptionKey",
                "Please initialize your encryption key."
            );

        if (string.IsNullOrEmpty(dataToDecrypt))
            return string.Empty;

        return Helper.DecryptString(dataToDecrypt, Key);
    }
}
