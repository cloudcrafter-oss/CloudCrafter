using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamsToEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "SourceProviders",
                type: "uuid",
                nullable: true
            );

            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "Servers",
                type: "uuid",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_SourceProviders_TeamId",
                table: "SourceProviders",
                column: "TeamId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Servers_TeamId",
                table: "Servers",
                column: "TeamId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Servers_Teams_TeamId",
                table: "Servers",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_SourceProviders_Teams_TeamId",
                table: "SourceProviders",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Servers_Teams_TeamId", table: "Servers");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceProviders_Teams_TeamId",
                table: "SourceProviders"
            );

            migrationBuilder.DropIndex(name: "IX_SourceProviders_TeamId", table: "SourceProviders");

            migrationBuilder.DropIndex(name: "IX_Servers_TeamId", table: "Servers");

            migrationBuilder.DropColumn(name: "TeamId", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "TeamId", table: "Servers");
        }
    }
}
