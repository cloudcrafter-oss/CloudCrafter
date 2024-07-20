using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ApplicationServices_ApplicationId",
                table: "ApplicationServices",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationServices_ApplicationServiceTypeId",
                table: "ApplicationServices",
                column: "ApplicationServiceTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_ApplicationServ~",
                table: "ApplicationServices",
                column: "ApplicationServiceTypeId",
                principalTable: "ApplicationServiceTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_Applications_ApplicationId",
                table: "ApplicationServices",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_ApplicationServ~",
                table: "ApplicationServices");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_Applications_ApplicationId",
                table: "ApplicationServices");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationServices_ApplicationId",
                table: "ApplicationServices");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationServices_ApplicationServiceTypeId",
                table: "ApplicationServices");
        }
    }
}
