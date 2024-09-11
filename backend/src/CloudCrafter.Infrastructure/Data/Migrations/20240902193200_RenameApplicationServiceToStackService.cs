using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameApplicationServiceToStackService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_ApplicationServ~",
                table: "ApplicationServices"
            );

            migrationBuilder.DropColumn(name: "ApplicationId", table: "ApplicationServices");

            migrationBuilder.RenameColumn(
                name: "ApplicationServiceTypeId",
                table: "ApplicationServices",
                newName: "StackServiceTypeId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationServices_ApplicationServiceTypeId",
                table: "ApplicationServices",
                newName: "IX_ApplicationServices_StackServiceTypeId"
            );

            migrationBuilder.UpdateData(
                table: "ApplicationServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("6257aa7c-09f0-42c0-8417-3d0ca0ead213"),
                column: "Type",
                value: "App"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_StackServiceTyp~",
                table: "ApplicationServices",
                column: "StackServiceTypeId",
                principalTable: "ApplicationServiceTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_StackServiceTyp~",
                table: "ApplicationServices"
            );

            migrationBuilder.RenameColumn(
                name: "StackServiceTypeId",
                table: "ApplicationServices",
                newName: "ApplicationServiceTypeId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationServices_StackServiceTypeId",
                table: "ApplicationServices",
                newName: "IX_ApplicationServices_ApplicationServiceTypeId"
            );

            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationId",
                table: "ApplicationServices",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000")
            );

            migrationBuilder.UpdateData(
                table: "ApplicationServiceTypes",
                keyColumn: "Id",
                keyValue: new Guid("6257aa7c-09f0-42c0-8417-3d0ca0ead213"),
                column: "Type",
                value: "AppType"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_ApplicationServiceTypes_ApplicationServ~",
                table: "ApplicationServices",
                column: "ApplicationServiceTypeId",
                principalTable: "ApplicationServiceTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
