using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddHttpHealthconfigurationToStackService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HealthcheckConfiguration_ExpectedHttpStatusCode",
                table: "StackServices",
                type: "integer",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "HealthcheckConfiguration_HttpHost",
                table: "StackServices",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "HealthcheckConfiguration_HttpMethod",
                table: "StackServices",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "HealthcheckConfiguration_HttpPath",
                table: "StackServices",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "HealthcheckConfiguration_HttpPort",
                table: "StackServices",
                type: "integer",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "HealthcheckConfiguration_HttpSchema",
                table: "StackServices",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "HealthcheckConfiguration_MaxRetries",
                table: "StackServices",
                type: "integer",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_ExpectedHttpStatusCode",
                table: "StackServices"
            );

            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_HttpHost",
                table: "StackServices"
            );

            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_HttpMethod",
                table: "StackServices"
            );

            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_HttpPath",
                table: "StackServices"
            );

            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_HttpPort",
                table: "StackServices"
            );

            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_HttpSchema",
                table: "StackServices"
            );

            migrationBuilder.DropColumn(
                name: "HealthcheckConfiguration_MaxRetries",
                table: "StackServices"
            );
        }
    }
}
