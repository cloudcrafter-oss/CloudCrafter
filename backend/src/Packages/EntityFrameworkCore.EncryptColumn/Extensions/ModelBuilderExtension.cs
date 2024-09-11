using EntityFrameworkCore.EncryptColumn.Attributes;
using EntityFrameworkCore.EncryptColumn.Converter;
using EntityFrameworkCore.EncryptColumn.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EntityFrameworkCore.EncryptColumn.Extensions;

public static class ModelBuilderExtension
{
    public static void UseEncryption(
        this ModelBuilder modelBuilder,
        IEncryptionProvider encryptionProvider
    )
    {
        if (modelBuilder is null)
            throw new ArgumentNullException(
                nameof(modelBuilder),
                "There is not ModelBuilder object."
            );
        if (encryptionProvider is null)
            throw new ArgumentNullException(
                nameof(encryptionProvider),
                "You should create encryption provider."
            );

        var encryptionConverter = new EncryptionConverter(encryptionProvider);
        foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (IMutableProperty property in entityType.GetProperties())
            {
                if (
                    property.ClrType == typeof(string)
                    && !IsDiscriminator(property)
                    && property.PropertyInfo != null
                )
                {
                    object[] attributes = property.PropertyInfo.GetCustomAttributes(
                        typeof(EncryptColumnAttribute),
                        false
                    );
                    if (attributes.Any())
                        property.SetValueConverter(encryptionConverter);
                }
            }
        }
    }

    private static bool IsDiscriminator(IMutableProperty property) =>
        property.Name == "Discriminator" || property.PropertyInfo == null;
}
