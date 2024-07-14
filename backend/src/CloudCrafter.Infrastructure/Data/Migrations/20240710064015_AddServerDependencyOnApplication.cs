using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddServerDependencyOnApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ServerId",
                table: "Applications",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Applications_ServerId",
                table: "Applications",
                column: "ServerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Servers_ServerId",
                table: "Applications",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Servers_ServerId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_ServerId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ServerId",
                table: "Applications");
        }
    }
}
