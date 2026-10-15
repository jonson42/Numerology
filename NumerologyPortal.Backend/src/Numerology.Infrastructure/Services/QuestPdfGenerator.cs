using Numerology.Application.Common.Interfaces;
using Numerology.Domain.ValueObjects;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Numerology.Infrastructure.Services;

public class QuestPdfGenerator : IPdfReportService
{
    static QuestPdfGenerator()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GenerateReportPdf(string fullName, DateTime birthDate, NumerologyMetrics metrics)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                // Header
                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("CỔNG TRA CỨU THẦN SỐ HỌC & TÂM LÝ").Bold().FontSize(16).FontColor("#6b21a8");
                        col.Item().Text("BÁO CÁO TOÀN DIỆN BẢN ĐỒ VẬN MỆNH PYTHAGORAS").FontSize(11).FontColor("#475569");
                    });

                    row.ConstantItem(120).AlignRight().Text($"Ngày xuất: {DateTime.Now:dd/MM/yyyy}").FontSize(9).FontColor("#94a3b8");
                });

                // Content
                page.Content().PaddingVertical(15).Column(col =>
                {
                    // Thông tin chủ sở hữu
                    col.Item().Background("#f8fafc").Border(1).BorderColor("#e2e8f0").Padding(12).Row(r =>
                    {
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text(t =>
                            {
                                t.Span("Họ và tên: ").SemiBold();
                                t.Span(fullName).Bold().FontColor("#1e293b");
                            });
                            c.Item().Text(t =>
                            {
                                t.Span("Ngày sinh dương lịch: ").SemiBold();
                                t.Span(birthDate.ToString("dd/MM/yyyy")).Bold().FontColor("#1e293b");
                            });
                        });

                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text(t =>
                            {
                                t.Span("Số Chủ Đạo: ").SemiBold();
                                t.Span(metrics.LifePathNumber.ToString()).Bold().FontColor("#7c3aed").FontSize(14);
                            });
                            c.Item().Text(t =>
                            {
                                t.Span("Sứ Mệnh: ").SemiBold();
                                t.Span(metrics.DestinyNumber.ToString()).Bold().FontColor("#2563eb").FontSize(14);
                            });
                        });
                    });

                    col.Item().PaddingTop(15).Text("1. BẢNG TỔNG HỢP CÁC CHỈ SỐ CỐT LÕI").Bold().FontSize(13).FontColor("#581c87");

                    // Bảng chỉ số
                    col.Item().PaddingTop(6).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(5);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background("#7e22ce").Padding(6).Text("Chỉ số").Bold().FontColor(Colors.White);
                            header.Cell().Background("#7e22ce").Padding(6).Text("Con số").Bold().FontColor(Colors.White);
                            header.Cell().Background("#7e22ce").Padding(6).Text("Ý nghĩa cốt lõi").Bold().FontColor(Colors.White);
                        });

                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Số Chủ Đạo (Life Path)");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(metrics.LifePathNumber.ToString()).Bold().FontColor("#7c3aed");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Bản thiết kế định mệnh, con đường sự nghiệp và bài học lớn nhất.");

                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Sứ Mệnh (Destiny)");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(metrics.DestinyNumber.ToString()).Bold().FontColor("#2563eb");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Năng lực hành động và giá trị bạn cống hiến cho xã hội.");

                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Linh Hồn (Soul Urge)");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(metrics.SoulUrgeNumber.ToString()).Bold().FontColor("#db2777");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Khát vọng sâu kín bên trong tâm hồn để có được hạnh phúc.");

                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Nhân Cách (Personality)");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(metrics.PersonalityNumber.ToString()).Bold().FontColor("#059669");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Phong thái đối ngoại và ấn tượng trong mắt người xung quanh.");

                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Thái Độ (Attitude)");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(metrics.AttitudeNumber.ToString()).Bold().FontColor("#d97706");
                        table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text("Phản xạ khi đối diện với thử thách và nghịch cảnh bất ngờ.");
                    });

                    // 4 Đỉnh cao Kim tự tháp
                    col.Item().PaddingTop(15).Text("2. KIM TỰ THÁP 4 ĐỈNH CAO CUỘC ĐỜI").Bold().FontSize(13).FontColor("#581c87");

                    col.Item().PaddingTop(6).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(4);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background("#4338ca").Padding(6).Text("Đỉnh cao").Bold().FontColor(Colors.White);
                            header.Cell().Background("#4338ca").Padding(6).Text("Năm đạt mốc").Bold().FontColor(Colors.White);
                            header.Cell().Background("#4338ca").Padding(6).Text("Con số đỉnh").Bold().FontColor(Colors.White);
                            header.Cell().Background("#4338ca").Padding(6).Text("Năng lượng giai đoạn").Bold().FontColor(Colors.White);
                        });

                        foreach (var p in metrics.PyramidPeaks.Peaks)
                        {
                            table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text($"Đỉnh {p.PeakIndex} ({p.MilestoneAge} tuổi)");
                            table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text($"Năm {p.MilestoneYear}");
                            table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(p.Value.ToString()).Bold().FontColor("#4338ca");
                            table.Cell().BorderBottom(1).BorderColor("#f1f5f9").Padding(6).Text(p.Description);
                        }
                    });

                    // Nợ nghiệp
                    col.Item().PaddingTop(15).Text("3. NỢ NGHIỆP & BÀI HỌC CHUYỂN HÓA").Bold().FontSize(13).FontColor("#581c87");
                    if (metrics.KarmicDebtNumbers.Count > 0)
                    {
                        foreach (var d in metrics.KarmicDebtNumbers)
                        {
                            col.Item().PaddingTop(4).Text($"• Nợ nghiệp {d}: Cần rèn luyện tính kiên nhẫn, tránh nóng vội và giữ gìn chữ tín để tích đức chuyển nghiệp.").FontColor("#b91c1c");
                        }
                    }
                    else
                    {
                        col.Item().PaddingTop(4).Text("• Chúc mừng! Bản đồ của bạn không ghi nhận nợ nghiệp nặng nề nào.").FontColor("#047857");
                    }
                });

                // Footer
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Báo cáo được tạo tự động bởi Hệ thống Thần Số Học Trực Tuyến - Trang ");
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }
}
