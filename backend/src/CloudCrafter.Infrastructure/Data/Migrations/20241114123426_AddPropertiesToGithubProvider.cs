using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertiesToGithubProvider : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppClientId",
                table: "GithubProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppClientSecret",
                table: "GithubProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<long>(
                name: "AppId",
                table: "GithubProviders",
                type: "bigint",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppName",
                table: "GithubProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppPrivateKey",
                table: "GithubProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "AppWebhookSecret",
                table: "GithubProviders",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "GithubProviders",
                type: "text",
                nullable: false,
                defaultValue: ""
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "AppClientId", table: "GithubProviders");

            migrationBuilder.DropColumn(name: "AppClientSecret", table: "GithubProviders");

            migrationBuilder.DropColumn(name: "AppId", table: "GithubProviders");

            migrationBuilder.DropColumn(name: "AppName", table: "GithubProviders");

            migrationBuilder.DropColumn(name: "AppPrivateKey", table: "GithubProviders");

            migrationBuilder.DropColumn(name: "AppWebhookSecret", table: "GithubProviders");

            migrationBuilder.DropColumn(name: "Name", table: "GithubProviders");
        }
    }
}
