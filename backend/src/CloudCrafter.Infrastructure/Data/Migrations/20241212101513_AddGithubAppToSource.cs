using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddGithubAppToSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Source_GithubApp_SourceProviderId",
                table: "Stacks",
                type: "uuid",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Stacks_Source_GithubApp_SourceProviderId",
                table: "Stacks",
                column: "Source_GithubApp_SourceProviderId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Stacks_SourceProviders_Source_GithubApp_SourceProviderId",
                table: "Stacks",
                column: "Source_GithubApp_SourceProviderId",
                principalTable: "SourceProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stacks_SourceProviders_Source_GithubApp_SourceProviderId",
                table: "Stacks"
            );

            migrationBuilder.DropIndex(
                name: "IX_Stacks_Source_GithubApp_SourceProviderId",
                table: "Stacks"
            );

            migrationBuilder.DropColumn(name: "Source_GithubApp_SourceProviderId", table: "Stacks");
        }
    }
}
