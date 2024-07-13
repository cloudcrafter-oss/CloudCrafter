    using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_ServerConnectivityCheckJob_ServerConnectivityCheckJobId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_ServerConnectivityCheckJobId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "ServerConnectivityCheckJobId",
                table: "Jobs");

            migrationBuilder.AddColumn<Guid>(
                name: "BackgroundJobId",
                table: "ServerConnectivityCheckJob",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServerConnectivityCheckJob_BackgroundJobId",
                table: "ServerConnectivityCheckJob",
                column: "BackgroundJobId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ServerConnectivityCheckJob_Jobs_BackgroundJobId",
                table: "ServerConnectivityCheckJob",
                column: "BackgroundJobId",
                principalTable: "Jobs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServerConnectivityCheckJob_Jobs_BackgroundJobId",
                table: "ServerConnectivityCheckJob");

            migrationBuilder.DropIndex(
                name: "IX_ServerConnectivityCheckJob_BackgroundJobId",
                table: "ServerConnectivityCheckJob");

            migrationBuilder.DropColumn(
                name: "BackgroundJobId",
                table: "ServerConnectivityCheckJob");

            migrationBuilder.AddColumn<Guid>(
                name: "ServerConnectivityCheckJobId",
                table: "Jobs",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_ServerConnectivityCheckJobId",
                table: "Jobs",
                column: "ServerConnectivityCheckJobId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_ServerConnectivityCheckJob_ServerConnectivityCheckJobId",
                table: "Jobs",
                column: "ServerConnectivityCheckJobId",
                principalTable: "ServerConnectivityCheckJob",
                principalColumn: "Id");
        }
    }
}
