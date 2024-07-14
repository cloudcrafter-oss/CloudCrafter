using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTimeTakenAndResultToCheck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Result",
                table: "ServerConnectivityCheckJob",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "TimeTakenMs",
                table: "ServerConnectivityCheckJob",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Result",
                table: "ServerConnectivityCheckJob");

            migrationBuilder.DropColumn(
                name: "TimeTakenMs",
                table: "ServerConnectivityCheckJob");
        }
    }
}
