using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MoveHealthToServerType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastServerData",
                table: "Servers",
                newName: "PingHealthData_OsInfo"
            );

            migrationBuilder.RenameColumn(
                name: "LastHealthPingReceivedAt",
                table: "Servers",
                newName: "PingHealthData_LastPingAt"
            );

            migrationBuilder.AddColumn<double>(
                name: "PingHealthData_CpuUsagePercentage",
                table: "Servers",
                type: "double precision",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "PingHealthData_DockerVersion",
                table: "Servers",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<double>(
                name: "PingHealthData_MemoryUsagePercentage",
                table: "Servers",
                type: "double precision",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "PingHealthData_TotalCpuCount",
                table: "Servers",
                type: "integer",
                nullable: true
            );

            migrationBuilder.AddColumn<long>(
                name: "PingHealthData_TotalMemoryBytes",
                table: "Servers",
                type: "bigint",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PingHealthData_CpuUsagePercentage",
                table: "Servers"
            );

            migrationBuilder.DropColumn(name: "PingHealthData_DockerVersion", table: "Servers");

            migrationBuilder.DropColumn(
                name: "PingHealthData_MemoryUsagePercentage",
                table: "Servers"
            );

            migrationBuilder.DropColumn(name: "PingHealthData_TotalCpuCount", table: "Servers");

            migrationBuilder.DropColumn(name: "PingHealthData_TotalMemoryBytes", table: "Servers");

            migrationBuilder.RenameColumn(
                name: "PingHealthData_OsInfo",
                table: "Servers",
                newName: "LastServerData"
            );

            migrationBuilder.RenameColumn(
                name: "PingHealthData_LastPingAt",
                table: "Servers",
                newName: "LastHealthPingReceivedAt"
            );
        }
    }
}
