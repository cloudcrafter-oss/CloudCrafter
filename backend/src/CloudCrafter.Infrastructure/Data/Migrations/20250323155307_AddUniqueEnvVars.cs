using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueEnvVars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "StackEnvironmentVariable",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "StackEnvironmentVariable",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text"
            );

            migrationBuilder.CreateIndex(
                name: "IX_StackEnvironmentVariable_Key_StackId",
                table: "StackEnvironmentVariable",
                columns: new[] { "Key", "StackId" },
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StackEnvironmentVariable_Key_StackId",
                table: "StackEnvironmentVariable"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "StackEnvironmentVariable",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000
            );

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "StackEnvironmentVariable",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100
            );
        }
    }
}
