﻿// <auto-generated />
using System;
using CloudCrafter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CloudCrafter.Infrastructure.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("CloudCrafter.Core.ContributorAggregate.Contributor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("Contributors");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.BackgroundJob", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CompletedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("HangfireJobId")
                        .HasColumnType("text");

                    b.Property<long?>("RunningTime")
                        .HasColumnType("bigint");

                    b.Property<string>("SerializedArguments")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("ServerConnectivityCheckJobId")
                        .HasColumnType("uuid");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ServerConnectivityCheckJobId");

                    b.ToTable("Jobs");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Deployment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("CreatedBy")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("LastModifiedBy")
                        .HasColumnType("uuid");

                    b.Property<Guid>("StackId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("StackId");

                    b.ToTable("Deployments");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Environment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Environments");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Jobs.ServerConnectivityCheckJob", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("CreatedBy")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("LastModifiedBy")
                        .HasColumnType("uuid");

                    b.Property<int>("Result")
                        .HasColumnType("integer");

                    b.Property<Guid>("ServerId")
                        .HasColumnType("uuid");

                    b.Property<long?>("TimeTakenMs")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ServerId");

                    b.ToTable("ServerConnectivityCheckJobs");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Server", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DockerDataDirectoryMount")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SshPort")
                        .HasColumnType("integer");

                    b.Property<string>("SshPrivateKey")
                        .HasColumnType("text");

                    b.Property<string>("SshUsername")
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Servers");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Stack", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("BuildPack")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("CreatedBy")
                        .HasColumnType("uuid");

                    b.Property<Guid>("EnvironmentId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("LastModifiedBy")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("ServerId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("EnvironmentId");

                    b.HasIndex("ServerId");

                    b.ToTable("Stacks");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.StackService", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("CreatedBy")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("LastModifiedBy")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("StackId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("StackServiceTypeId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("StackId");

                    b.HasIndex("StackServiceTypeId");

                    b.ToTable("StackServices");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.StackServiceType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("StackServiceTypes");

                    b.HasData(
                        new
                        {
                            Id = new Guid("6257aa7c-09f0-42c0-8417-3d0ca0ead213"),
                            Type = "App"
                        });
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.UserRefreshToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("Token")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("UserRefreshTokens");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("CloudCrafter.Core.ContributorAggregate.Contributor", b =>
                {
                    b.OwnsOne("CloudCrafter.Core.ContributorAggregate.PhoneNumber", "PhoneNumber", b1 =>
                        {
                            b1.Property<int>("ContributorId")
                                .HasColumnType("integer");

                            b1.Property<string>("CountryCode")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("Extension")
                                .HasColumnType("text");

                            b1.Property<string>("Number")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("ContributorId");

                            b1.ToTable("Contributors");

                            b1.WithOwner()
                                .HasForeignKey("ContributorId");
                        });

                    b.Navigation("PhoneNumber");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.BackgroundJob", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Jobs.ServerConnectivityCheckJob", "ServerConnectivityCheckJob")
                        .WithMany()
                        .HasForeignKey("ServerConnectivityCheckJobId");

                    b.OwnsMany("CloudCrafter.Domain.Entities.BackgroundJobLog", "Logs", b1 =>
                        {
                            b1.Property<Guid>("BackgroundJobId")
                                .HasColumnType("uuid");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("integer");

                            b1.Property<string>("Exception")
                                .HasColumnType("text");

                            b1.Property<string>("Level")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("Message")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<DateTime>("Timestamp")
                                .HasColumnType("timestamp with time zone");

                            b1.HasKey("BackgroundJobId", "Id");

                            b1.ToTable("Jobs");

                            b1.ToJson("Logs");

                            b1.WithOwner()
                                .HasForeignKey("BackgroundJobId");
                        });

                    b.Navigation("Logs");

                    b.Navigation("ServerConnectivityCheckJob");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Deployment", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Stack", "Stack")
                        .WithMany("Deployments")
                        .HasForeignKey("StackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsMany("CloudCrafter.Domain.Entities.DeploymentLog", "Logs", b1 =>
                        {
                            b1.Property<Guid>("DeploymentId")
                                .HasColumnType("uuid");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("integer");

                            b1.Property<string>("Log")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("DeploymentId", "Id");

                            b1.ToTable("Deployments");

                            b1.ToJson("Logs");

                            b1.WithOwner()
                                .HasForeignKey("DeploymentId");
                        });

                    b.Navigation("Logs");

                    b.Navigation("Stack");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Environment", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Project", "Project")
                        .WithMany("Environments")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Jobs.ServerConnectivityCheckJob", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Server", "Server")
                        .WithMany()
                        .HasForeignKey("ServerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Server");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Stack", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Environment", "Environment")
                        .WithMany("Stacks")
                        .HasForeignKey("EnvironmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CloudCrafter.Domain.Entities.Server", "Server")
                        .WithMany()
                        .HasForeignKey("ServerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("CloudCrafter.Domain.Entities.ApplicationSource", "Source", b1 =>
                        {
                            b1.Property<Guid>("StackId")
                                .HasColumnType("uuid");

                            b1.Property<int>("Type")
                                .HasColumnType("integer");

                            b1.HasKey("StackId");

                            b1.ToTable("Stacks");

                            b1.WithOwner()
                                .HasForeignKey("StackId");

                            b1.OwnsOne("CloudCrafter.Domain.Entities.ApplicationSourceGit", "Git", b2 =>
                                {
                                    b2.Property<Guid>("ApplicationSourceStackId")
                                        .HasColumnType("uuid");

                                    b2.Property<string>("Branch")
                                        .HasColumnType("text");

                                    b2.Property<string>("Path")
                                        .HasColumnType("text");

                                    b2.Property<string>("Repository")
                                        .IsRequired()
                                        .HasColumnType("text");

                                    b2.HasKey("ApplicationSourceStackId");

                                    b2.ToTable("Stacks");

                                    b2.WithOwner()
                                        .HasForeignKey("ApplicationSourceStackId");
                                });

                            b1.Navigation("Git");
                        });

                    b.Navigation("Environment");

                    b.Navigation("Server");

                    b.Navigation("Source");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.StackService", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Stack", "Stack")
                        .WithMany("Services")
                        .HasForeignKey("StackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CloudCrafter.Domain.Entities.StackServiceType", "Type")
                        .WithMany()
                        .HasForeignKey("StackServiceTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("CloudCrafter.Domain.Entities.EntityHealthStatus", "HealthStatus", b1 =>
                        {
                            b1.Property<Guid>("StackServiceId")
                                .HasColumnType("uuid");

                            b1.Property<DateTime?>("StatusAt")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<int>("Value")
                                .HasColumnType("integer");

                            b1.HasKey("StackServiceId");

                            b1.ToTable("StackServices");

                            b1.WithOwner()
                                .HasForeignKey("StackServiceId");
                        });

                    b.OwnsOne("CloudCrafter.Domain.Entities.EntityHealthcheckConfiguration", "HealthcheckConfiguration", b1 =>
                        {
                            b1.Property<Guid>("StackServiceId")
                                .HasColumnType("uuid");

                            b1.Property<int?>("ExpectedHttpStatusCode")
                                .HasColumnType("integer");

                            b1.Property<string>("HttpHost")
                                .HasColumnType("text");

                            b1.Property<string>("HttpMethod")
                                .HasColumnType("text");

                            b1.Property<string>("HttpPath")
                                .HasColumnType("text");

                            b1.Property<int?>("HttpPort")
                                .HasColumnType("integer");

                            b1.Property<string>("HttpSchema")
                                .HasColumnType("text");

                            b1.Property<int?>("MaxRetries")
                                .HasColumnType("integer");

                            b1.Property<bool?>("UseDockerHealthCheck")
                                .HasColumnType("boolean");

                            b1.HasKey("StackServiceId");

                            b1.ToTable("StackServices");

                            b1.WithOwner()
                                .HasForeignKey("StackServiceId");
                        });

                    b.OwnsOne("CloudCrafter.Domain.Entities.EntityHttpConfiguration", "HttpConfiguration", b1 =>
                        {
                            b1.Property<Guid>("StackServiceId")
                                .HasColumnType("uuid");

                            b1.Property<int?>("ContainerHttpPort")
                                .HasColumnType("integer");

                            b1.Property<string>("DomainName")
                                .HasColumnType("text");

                            b1.HasKey("StackServiceId");

                            b1.ToTable("StackServices");

                            b1.WithOwner()
                                .HasForeignKey("StackServiceId");
                        });

                    b.Navigation("HealthStatus")
                        .IsRequired();

                    b.Navigation("HealthcheckConfiguration")
                        .IsRequired();

                    b.Navigation("HttpConfiguration");

                    b.Navigation("Stack");

                    b.Navigation("Type");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.UserRefreshToken", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.User", null)
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Role", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.Role", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CloudCrafter.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.HasOne("CloudCrafter.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Environment", b =>
                {
                    b.Navigation("Stacks");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Project", b =>
                {
                    b.Navigation("Environments");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.Stack", b =>
                {
                    b.Navigation("Deployments");

                    b.Navigation("Services");
                });

            modelBuilder.Entity("CloudCrafter.Domain.Entities.User", b =>
                {
                    b.Navigation("RefreshTokens");
                });
#pragma warning restore 612, 618
        }
    }
}
