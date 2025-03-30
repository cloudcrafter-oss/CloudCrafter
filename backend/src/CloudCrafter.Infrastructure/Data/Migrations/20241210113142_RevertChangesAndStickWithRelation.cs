using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RevertChangesAndStickWithRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    AppName = table.Column<string>(type: "text", nullable: true),
                    AppId = table.Column<long>(type: "bigint", nullable: true),
                    AppClientId = table.Column<string>(type: "text", nullable: true),
                    AppClientSecret = table.Column<string>(type: "text", nullable: true),
                    AppWebhookSecret = table.Column<string>(type: "text", nullable: true),
                    AppPrivateKey = table.Column<string>(type: "text", nullable: true),
                    IsValid = table.Column<bool>(type: "boolean", nullable: true),
                    InstallationId = table.Column<long>(type: "bigint", nullable: true),
                    AppUrl = table.Column<string>(type: "text", nullable: true),
                    SourceProviderId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GithubProviders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GithubProviders_SourceProviders_SourceProviderId",
                        column: x => x.SourceProviderId,
                        principalTable: "SourceProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_GithubProviders_SourceProviderId",
                table: "GithubProviders",
                column: "SourceProviderId",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "GithubProviders");

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
    }
}
