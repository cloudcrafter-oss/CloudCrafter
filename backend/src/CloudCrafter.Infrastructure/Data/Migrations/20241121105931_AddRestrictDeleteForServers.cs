using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRestrictDeleteForServers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Stacks_Servers_ServerId", table: "Stacks");

            migrationBuilder.AddForeignKey(
                name: "FK_Stacks_Servers_ServerId",
                table: "Stacks",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Stacks_Servers_ServerId", table: "Stacks");

            migrationBuilder.AddForeignKey(
                name: "FK_Stacks_Servers_ServerId",
                table: "Stacks",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
