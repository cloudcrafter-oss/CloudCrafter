using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class GroupsSetCascadeNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StackEnvironmentVariables_StackEnvironmentVariableGroups_Gr~",
                table: "StackEnvironmentVariables"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_StackEnvironmentVariables_StackEnvironmentVariableGroups_Gr~",
                table: "StackEnvironmentVariables",
                column: "GroupId",
                principalTable: "StackEnvironmentVariableGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StackEnvironmentVariables_StackEnvironmentVariableGroups_Gr~",
                table: "StackEnvironmentVariables"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_StackEnvironmentVariables_StackEnvironmentVariableGroups_Gr~",
                table: "StackEnvironmentVariables",
                column: "GroupId",
                principalTable: "StackEnvironmentVariableGroups",
                principalColumn: "Id"
            );
        }
    }
}
