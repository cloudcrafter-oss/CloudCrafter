using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameApplicationToStacks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_Applications_ApplicationId",
                table: "ApplicationServices"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_Deployments_Applications_ApplicationId",
                table: "Deployments"
            );

            migrationBuilder.DropTable(name: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationServices_ApplicationId",
                table: "ApplicationServices"
            );

            migrationBuilder.RenameColumn(
                name: "ApplicationId",
                table: "Deployments",
                newName: "StackId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Deployments_ApplicationId",
                table: "Deployments",
                newName: "IX_Deployments_StackId"
            );

            migrationBuilder.AddColumn<Guid>(
                name: "StackId",
                table: "ApplicationServices",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000")
            );

            migrationBuilder.CreateTable(
                name: "Stacks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    EnvironmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source_Type = table.Column<int>(type: "integer", nullable: true),
                    Source_Git_Repository = table.Column<string>(type: "text", nullable: true),
                    Source_Git_Branch = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stacks_Environments_EnvironmentId",
                        column: x => x.EnvironmentId,
                        principalTable: "Environments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Stacks_Servers_ServerId",
                        column: x => x.ServerId,
                        principalTable: "Servers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationServices_StackId",
                table: "ApplicationServices",
                column: "StackId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Stacks_EnvironmentId",
                table: "Stacks",
                column: "EnvironmentId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Stacks_ServerId",
                table: "Stacks",
                column: "ServerId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_Stacks_StackId",
                table: "ApplicationServices",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Deployments_Stacks_StackId",
                table: "Deployments",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationServices_Stacks_StackId",
                table: "ApplicationServices"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_Deployments_Stacks_StackId",
                table: "Deployments"
            );

            migrationBuilder.DropTable(name: "Stacks");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationServices_StackId",
                table: "ApplicationServices"
            );

            migrationBuilder.DropColumn(name: "StackId", table: "ApplicationServices");

            migrationBuilder.RenameColumn(
                name: "StackId",
                table: "Deployments",
                newName: "ApplicationId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Deployments_StackId",
                table: "Deployments",
                newName: "IX_Deployments_ApplicationId"
            );

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EnvironmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Source_Type = table.Column<int>(type: "integer", nullable: true),
                    Source_Git_Branch = table.Column<string>(type: "text", nullable: true),
                    Source_Git_Repository = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_Environments_EnvironmentId",
                        column: x => x.EnvironmentId,
                        principalTable: "Environments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Applications_Servers_ServerId",
                        column: x => x.ServerId,
                        principalTable: "Servers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationServices_ApplicationId",
                table: "ApplicationServices",
                column: "ApplicationId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Applications_EnvironmentId",
                table: "Applications",
                column: "EnvironmentId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Applications_ServerId",
                table: "Applications",
                column: "ServerId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationServices_Applications_ApplicationId",
                table: "ApplicationServices",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Deployments_Applications_ApplicationId",
                table: "Deployments",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
