using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStackServiceVolumes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StackServiceVolumes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StackServiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SourcePath = table.Column<string>(type: "text", nullable: true),
                    DestinationPath = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_StackServiceVolumes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StackServiceVolumes_StackServices_StackServiceId",
                        column: x => x.StackServiceId,
                        principalTable: "StackServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_StackServiceVolumes_StackServiceId",
                table: "StackServiceVolumes",
                column: "StackServiceId"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "StackServiceVolumes");
        }
    }
}
