using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEnvVars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StackEnvironmentVariable_Stacks_StackId",
                table: "StackEnvironmentVariable"
            );

            migrationBuilder.DropPrimaryKey(
                name: "PK_StackEnvironmentVariable",
                table: "StackEnvironmentVariable"
            );

            migrationBuilder.RenameTable(
                name: "StackEnvironmentVariable",
                newName: "StackEnvironmentVariables"
            );

            migrationBuilder.RenameIndex(
                name: "IX_StackEnvironmentVariable_StackId",
                table: "StackEnvironmentVariables",
                newName: "IX_StackEnvironmentVariables_StackId"
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_StackEnvironmentVariables",
                table: "StackEnvironmentVariables",
                column: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_StackEnvironmentVariables_Stacks_StackId",
                table: "StackEnvironmentVariables",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StackEnvironmentVariables_Stacks_StackId",
                table: "StackEnvironmentVariables"
            );

            migrationBuilder.DropPrimaryKey(
                name: "PK_StackEnvironmentVariables",
                table: "StackEnvironmentVariables"
            );

            migrationBuilder.RenameTable(
                name: "StackEnvironmentVariables",
                newName: "StackEnvironmentVariable"
            );

            migrationBuilder.RenameIndex(
                name: "IX_StackEnvironmentVariables_StackId",
                table: "StackEnvironmentVariable",
                newName: "IX_StackEnvironmentVariable_StackId"
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_StackEnvironmentVariable",
                table: "StackEnvironmentVariable",
                column: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_StackEnvironmentVariable_Stacks_StackId",
                table: "StackEnvironmentVariable",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
