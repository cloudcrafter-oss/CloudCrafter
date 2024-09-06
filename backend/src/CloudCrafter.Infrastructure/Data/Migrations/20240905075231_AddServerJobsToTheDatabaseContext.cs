using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddServerJobsToTheDatabaseContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_ServerConnectivityCheckJob_ServerConnectivityCheckJobId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_ServerConnectivityCheckJob_Servers_ServerId",
                table: "ServerConnectivityCheckJob");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ServerConnectivityCheckJob",
                table: "ServerConnectivityCheckJob");

            migrationBuilder.RenameTable(
                name: "ServerConnectivityCheckJob",
                newName: "ServerConnectivityCheckJobs");

            migrationBuilder.RenameIndex(
                name: "IX_ServerConnectivityCheckJob_ServerId",
                table: "ServerConnectivityCheckJobs",
                newName: "IX_ServerConnectivityCheckJobs_ServerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ServerConnectivityCheckJobs",
                table: "ServerConnectivityCheckJobs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_ServerConnectivityCheckJobs_ServerConnectivityCheckJob~",
                table: "Jobs",
                column: "ServerConnectivityCheckJobId",
                principalTable: "ServerConnectivityCheckJobs",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ServerConnectivityCheckJobs_Servers_ServerId",
                table: "ServerConnectivityCheckJobs",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_ServerConnectivityCheckJobs_ServerConnectivityCheckJob~",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_ServerConnectivityCheckJobs_Servers_ServerId",
                table: "ServerConnectivityCheckJobs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ServerConnectivityCheckJobs",
                table: "ServerConnectivityCheckJobs");

            migrationBuilder.RenameTable(
                name: "ServerConnectivityCheckJobs",
                newName: "ServerConnectivityCheckJob");

            migrationBuilder.RenameIndex(
                name: "IX_ServerConnectivityCheckJobs_ServerId",
                table: "ServerConnectivityCheckJob",
                newName: "IX_ServerConnectivityCheckJob_ServerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ServerConnectivityCheckJob",
                table: "ServerConnectivityCheckJob",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_ServerConnectivityCheckJob_ServerConnectivityCheckJobId",
                table: "Jobs",
                column: "ServerConnectivityCheckJobId",
                principalTable: "ServerConnectivityCheckJob",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ServerConnectivityCheckJob_Servers_ServerId",
                table: "ServerConnectivityCheckJob",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
