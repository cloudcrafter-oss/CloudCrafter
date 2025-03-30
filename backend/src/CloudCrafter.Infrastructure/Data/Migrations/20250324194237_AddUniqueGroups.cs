using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_StackEnvironmentVariableGroup_Name_StackId",
                table: "StackEnvironmentVariableGroups",
                columns: new[] { "Name", "StackId" },
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StackEnvironmentVariableGroup_Name_StackId",
                table: "StackEnvironmentVariableGroups"
            );
        }
    }
}
