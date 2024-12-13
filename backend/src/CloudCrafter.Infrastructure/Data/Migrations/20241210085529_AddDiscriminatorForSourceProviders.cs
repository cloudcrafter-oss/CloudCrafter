using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscriminatorForSourceProviders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SourceProviders_GithubProviders_GithubProviderId",
                table: "SourceProviders"
            );

            migrationBuilder.DropTable(name: "GithubProviders");

            migrationBuilder.DropIndex(
                name: "IX_SourceProviders_GithubProviderId",
                table: "SourceProviders"
            );

            migrationBuilder.DropColumn(name: "GithubProviderId", table: "SourceProviders");

            migrationBuilder.AddColumn<string>(
                name: "AppClientId",
                table: "SourceProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppClientSecret",
                table: "SourceProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<long>(
                name: "AppId",
                table: "SourceProviders",
                type: "bigint",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppName",
                table: "SourceProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppPrivateKey",
                table: "SourceProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppUrl",
                table: "SourceProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppWebhookSecret",
                table: "SourceProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<long>(
                name: "InstallationId",
                table: "SourceProviders",
                type: "bigint",
                nullable: true
            );

            migrationBuilder.AddColumn<bool>(
                name: "IsValid",
                table: "SourceProviders",
                type: "boolean",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "ProviderType",
                table: "SourceProviders",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "AppClientId", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "AppClientSecret", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "AppId", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "AppName", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "AppPrivateKey", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "AppUrl", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "AppWebhookSecret", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "InstallationId", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "IsValid", table: "SourceProviders");

            migrationBuilder.DropColumn(name: "ProviderType", table: "SourceProviders");

            migrationBuilder.AddColumn<Guid>(
                name: "GithubProviderId",
                table: "SourceProviders",
                type: "uuid",
                nullable: true
            );

            migrationBuilder.CreateTable(
                name: "GithubProviders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AppClientId = table.Column<string>(type: "text", nullable: true),
                    AppClientSecret = table.Column<string>(type: "text", nullable: true),
                    AppId = table.Column<long>(type: "bigint", nullable: true),
                    AppName = table.Column<string>(type: "text", nullable: true),
                    AppPrivateKey = table.Column<string>(type: "text", nullable: true),
                    AppUrl = table.Column<string>(type: "text", nullable: true),
                    AppWebhookSecret = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    InstallationId = table.Column<long>(type: "bigint", nullable: true),
                    IsValid = table.Column<bool>(type: "boolean", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GithubProviders", x => x.Id);
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_SourceProviders_GithubProviderId",
                table: "SourceProviders",
                column: "GithubProviderId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_SourceProviders_GithubProviders_GithubProviderId",
                table: "SourceProviders",
                column: "GithubProviderId",
                principalTable: "GithubProviders",
                principalColumn: "Id"
            );
        }
    }
}
