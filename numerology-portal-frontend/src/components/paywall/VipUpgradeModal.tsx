import React, { useState, useEffect } from 'react';
import { X, Crown, QrCode, CheckCircle2, ShieldCheck, Zap, Copy, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { paymentApi } from '../../api/paymentApi';
import type { OrderDetailResponse } from '../../types/payment.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialPhone?: string;
}

export const VipUpgradeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = ''
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [packageType, setPackageType] = useState<'1_YEAR' | 'LIFETIME'>('1_YEAR');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (initialPhone && !phoneNumber) {
      setPhoneNumber(initialPhone);
    }
  }, [initialPhone]);

  // Polling trạng thái thanh toán từ SePay webhook
  useEffect(() => {
    if (!order || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await paymentApi.checkOrderStatus(order.orderCode);
        if (res.success && res.data.isPaid) {
          setIsPaid(true);
          triggerConfetti();
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2500);
        }
      } catch (err) {
        // Polling error silently
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order, isPaid]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setLoading(true);
    try {
      const res = await paymentApi.createOrder(phoneNumber, packageType);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err: any) {
      alert(err?.message || 'Có lỗi khi khởi tạo đơn hàng thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await paymentApi.simulatePaymentSuccess(order.orderCode);
      if (res.success) {
        setIsPaid(true);
        triggerConfetti();
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi mô phỏng');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0824] border border-amber-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-slate-100 my-8">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isPaid ? (
          /* Màn hình thông báo thành công */
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold font-cinzel text-emerald-300">
              KÍCH HOẠT VIP THÀNH CÔNG!
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Hệ thống SePay đã ghi nhận giao dịch thành công. Toàn bộ 26+ chỉ số và báo cáo chuyên sâu của bạn đã được mở khóa hoàn toàn!
            </p>
          </div>
        ) : !order ? (
          /* Màn hình chọn gói và nhập số điện thoại */
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-cinzel text-amber-300">
                  Nâng Cấp VIP Báo Cáo
                </h3>
                <p className="text-xs text-slate-400">
                  Mở khóa trọn bộ 26+ chỉ số & Kim tự tháp vận số
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-5">
              {/* Chọn gói VIP */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase">
                  Chọn gói thành viên:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPackageType('1_YEAR')}
                    className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                      packageType === '1_YEAR'
                        ? 'bg-purple-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs text-purple-300 font-semibold block">Gói 1 Năm</span>
                    <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">
                      199.000đ
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Đủ mọi tính năng</span>
                  </div>

                  <div
                    onClick={() => setPackageType('LIFETIME')}
                    className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                      packageType === 'LIFETIME'
                        ? 'bg-purple-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                      TIẾT KIỆM 60%
                    </span>
                    <span className="text-xs text-purple-300 font-semibold block">Gói Trọn Đời</span>
                    <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">
                      399.000đ
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Sử dụng mãi mãi</span>
                  </div>
                </div>
              </div>

              {/* Nhập số điện thoại */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase">
                  Số điện thoại kích hoạt (+84):
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono"
                />
              </div>

              {/* Lợi ích VIP */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Xem đầy đủ toàn bộ 26+ chỉ số chuyên sâu không bị che</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Luận giải 4 đỉnh cao Kim tự tháp & 4 thử thách</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Xuất file PDF báo cáo in ấn chuẩn chuyên gia</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-bold text-sm sm:text-base hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                Tạo Mã VietQR Thanh Toán Ngay
              </button>
            </form>
          </div>
        ) : (
          /* Màn hình hiển thị mã VietQR chuyển khoản */
          <div className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Đơn hàng: {order.orderCode} • {order.packageName}
              </span>
              <h3 className="text-xl font-bold font-cinzel text-white mt-2">
                Quét Mã VietQR Chuyển Khoản
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mở ứng dụng ngân hàng bất kỳ để quét mã và chuyển đúng số tiền
              </p>
            </div>

            {/* Khung ảnh QR VietQR */}
            <div className="flex justify-center p-3 bg-white rounded-2xl w-fit mx-auto shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              <img
                src={order.vietQrInfo.qrImageUrl}
                alt="VietQR Payment"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
              />
            </div>

            {/* Chi tiết chuyển khoản thủ công */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ngân hàng:</span>
                <span className="font-bold text-slate-200">{order.vietQrInfo.bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {order.vietQrInfo.accountNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(order.vietQrInfo.accountNumber, 'acc')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Chủ tài khoản:</span>
                <span className="font-bold text-slate-200">{order.vietQrInfo.accountName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Số tiền:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {order.amount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-400 text-sm bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                    {order.vietQrInfo.transferContent}
                  </span>
                  <button
                    onClick={() => copyToClipboard(order.vietQrInfo.transferContent, 'content')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {copiedField && (
              <p className="text-center text-xs text-emerald-400 animate-pulse">
                ✓ Đã sao chép vào bộ nhớ tạm!
              </p>
            )}

            {/* Trạng thái chờ SePay Webhook */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-purple-300">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Hệ thống đang tự động lắng nghe thanh toán từ SePay...</span>
              </div>
            </div>

            {/* Nút mô phỏng thanh toán thành công (Dành cho kiểm thử) */}
            <button
              onClick={handleSimulatePayment}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              ⚡ Thử nghiệm ngay: Mô phỏng SePay đã nhận tiền (Instant VIP)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
