using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSshColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "SshPrivateKey", table: "Servers");

            migrationBuilder.DropColumn(name: "SshUsername", table: "Servers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SshPrivateKey",
                table: "Servers",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "SshUsername",
                table: "Servers",
                type: "text",
                nullable: true
            );
        }
    }
}
