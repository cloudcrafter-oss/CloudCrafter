using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEnvironmentVarGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GroupId",
                table: "StackEnvironmentVariables",
                type: "uuid",
                nullable: true
            );

            migrationBuilder.CreateTable(
                name: "StackEnvironmentVariableGroups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    StackId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uuid", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StackEnvironmentVariableGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StackEnvironmentVariableGroups_Stacks_StackId",
                        column: x => x.StackId,
                        principalTable: "Stacks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_StackEnvironmentVariables_GroupId",
                table: "StackEnvironmentVariables",
                column: "GroupId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_StackEnvironmentVariableGroups_StackId",
                table: "StackEnvironmentVariableGroups",
                column: "StackId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_StackEnvironmentVariables_StackEnvironmentVariableGroups_Gr~",
                table: "StackEnvironmentVariables",
                column: "GroupId",
                principalTable: "StackEnvironmentVariableGroups",
                principalColumn: "Id"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StackEnvironmentVariables_StackEnvironmentVariableGroups_Gr~",
                table: "StackEnvironmentVariables"
            );

            migrationBuilder.DropTable(name: "StackEnvironmentVariableGroups");

            migrationBuilder.DropIndex(
                name: "IX_StackEnvironmentVariables_GroupId",
                table: "StackEnvironmentVariables"
            );

            migrationBuilder.DropColumn(name: "GroupId", table: "StackEnvironmentVariables");
        }
    }
}
