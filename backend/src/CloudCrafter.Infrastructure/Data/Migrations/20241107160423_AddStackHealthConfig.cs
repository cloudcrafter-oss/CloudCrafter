using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStackHealthConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "HealthStatus_StatusAt",
                table: "Stacks",
                type: "timestamp with time zone",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "HealthStatus_Value",
                table: "Stacks",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "HealthStatus_StatusAt", table: "Stacks");

            migrationBuilder.DropColumn(name: "HealthStatus_Value", table: "Stacks");
        }
    }
}
