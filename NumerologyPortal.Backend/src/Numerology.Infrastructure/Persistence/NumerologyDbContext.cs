using Microsoft.EntityFrameworkCore;
using Numerology.Domain.Entities;

namespace Numerology.Infrastructure.Persistence;

public class NumerologyDbContext : DbContext
{
    public NumerologyDbContext(DbContextOptions<NumerologyDbContext> options) : base(options)
    {
    }

    public DbSet<UserAccount> Users => Set<UserAccount>();
    public DbSet<LookupReport> Reports => Set<LookupReport>();
    public DbSet<InterpretationMaster> Interpretations => Set<InterpretationMaster>();
    public DbSet<TransactionOrder> Orders => Set<TransactionOrder>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // UserAccount
        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PhoneNumber).IsUnique();
            entity.Property(e => e.PhoneNumber).HasMaxLength(20).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.Role).HasMaxLength(20).HasDefaultValue("User");
        });

        // LookupReport
        modelBuilder.Entity<LookupReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ShareToken).IsUnique();
            entity.Property(e => e.ShareToken).HasMaxLength(50).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(150).IsRequired();

            entity.HasOne(e => e.User)
                .WithMany(u => u.Reports)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // InterpretationMaster
        modelBuilder.Entity<InterpretationMaster>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ServiceType, e.IndicatorCode, e.NumberKey }).IsUnique();
            entity.Property(e => e.IndicatorCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.IndicatorName).HasMaxLength(100);
            entity.Property(e => e.NumberKey).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        // TransactionOrder
        modelBuilder.Entity<TransactionOrder>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OrderCode).IsUnique();
            entity.Property(e => e.OrderCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.TransferContent).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // SystemSetting
        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Key).IsUnique();
            entity.Property(e => e.Key).HasMaxLength(100).IsRequired();
        });
    }
}
