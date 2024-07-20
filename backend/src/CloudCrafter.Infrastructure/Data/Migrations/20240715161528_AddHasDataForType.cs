using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddHasDataForType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ApplicationServiceTypes",
                columns: new[] { "Id", "Type" },
                values: new object[] { new Guid("6257aa7c-09f0-42c0-8417-3d0ca0ead213"), "AppType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ApplicationServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("6257aa7c-09f0-42c0-8417-3d0ca0ead213"));
        }
    }
}
