using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_StackServiceTyp~",
                table: "ApplicationServices");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_Stacks_StackId",
                table: "ApplicationServices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicationServiceTypes",
                table: "ApplicationServiceTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicationServices",
                table: "ApplicationServices");

            migrationBuilder.RenameTable(
                name: "ApplicationServiceTypes",
                newName: "StackServiceTypes");

            migrationBuilder.RenameTable(
                name: "ApplicationServices",
                newName: "StackServices");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationServices_StackServiceTypeId",
                table: "StackServices",
                newName: "IX_StackServices_StackServiceTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationServices_StackId",
                table: "StackServices",
                newName: "IX_StackServices_StackId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StackServiceTypes",
                table: "StackServiceTypes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StackServices",
                table: "StackServices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StackServices_StackServiceTypes_StackServiceTypeId",
                table: "StackServices",
                column: "StackServiceTypeId",
                principalTable: "StackServiceTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StackServices_Stacks_StackId",
                table: "StackServices",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StackServices_StackServiceTypes_StackServiceTypeId",
                table: "StackServices");

            migrationBuilder.DropForeignKey(
                name: "FK_StackServices_Stacks_StackId",
                table: "StackServices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StackServiceTypes",
                table: "StackServiceTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StackServices",
                table: "StackServices");

            migrationBuilder.RenameTable(
                name: "StackServiceTypes",
                newName: "ApplicationServiceTypes");

            migrationBuilder.RenameTable(
                name: "StackServices",
                newName: "ApplicationServices");

            migrationBuilder.RenameIndex(
                name: "IX_StackServices_StackServiceTypeId",
                table: "ApplicationServices",
                newName: "IX_ApplicationServices_StackServiceTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_StackServices_StackId",
                table: "ApplicationServices",
                newName: "IX_ApplicationServices_StackId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ApplicationServiceTypes",
                table: "ApplicationServiceTypes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ApplicationServices",
                table: "ApplicationServices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_StackServiceTyp~",
                table: "ApplicationServices",
                column: "StackServiceTypeId",
                principalTable: "ApplicationServiceTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_Stacks_StackId",
                table: "ApplicationServices",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
