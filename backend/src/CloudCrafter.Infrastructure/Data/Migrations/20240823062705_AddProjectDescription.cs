using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Projects",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Projects");
        }
    }
}
