using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnsForSourceProvider : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Source_GithubApp_Branch",
                table: "Stacks",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "Source_GithubApp_Repository",
                table: "Stacks",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "Source_GithubApp_RepositoryId",
                table: "Stacks",
                type: "text",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Source_GithubApp_Branch", table: "Stacks");

            migrationBuilder.DropColumn(name: "Source_GithubApp_Repository", table: "Stacks");

            migrationBuilder.DropColumn(name: "Source_GithubApp_RepositoryId", table: "Stacks");
        }
    }
}
