using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HealthStatus_IsRunning",
                table: "StackServices",
                type: "boolean",
                nullable: false,
                defaultValue: false
            );

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

            migrationBuilder.AddColumn<string>(
                name: "RecipeYaml",
                table: "Deployments",
                type: "text",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "HealthStatus_IsRunning", table: "StackServices");

            migrationBuilder.DropColumn(name: "HealthStatus_StatusAt", table: "Stacks");

            migrationBuilder.DropColumn(name: "HealthStatus_Value", table: "Stacks");

            migrationBuilder.DropColumn(name: "RecipeYaml", table: "Deployments");
        }
    }
}
