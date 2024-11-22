using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServerEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Servers",
                type: "uuid",
                nullable: true
            );

            migrationBuilder.AddColumn<Guid>(
                name: "LastModifiedBy",
                table: "Servers",
                type: "uuid",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "CreatedBy", table: "Servers");

            migrationBuilder.DropColumn(name: "LastModifiedBy", table: "Servers");
        }
    }
}
