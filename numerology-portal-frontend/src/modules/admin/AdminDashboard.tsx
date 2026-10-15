import React, { useState, useEffect } from 'react';
import { adminApi, type DashboardStats, type InterpretationItem } from '../../api/adminApi';
import {
  Users,
  Crown,
  DollarSign,
  FileText,
  ShoppingBag,
  Edit,
  Save,
  X,
  Search,
  CheckCircle2,
  RefreshCw,
  Loader2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [interpretations, setInterpretations] = useState<InterpretationItem[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'STATS' | 'INTERPRETATIONS' | 'ORDERS' | 'USERS'>('STATS');
  const [loading, setLoading] = useState(false);

  // Modal chỉnh sửa luận giải
  const [editingItem, setEditingItem] = useState<InterpretationItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, interRes, ordersRes, usersRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getInterpretations(),
        adminApi.getOrders(),
        adminApi.getUsers(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (interRes.success) setInterpretations(interRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      const res = await adminApi.updateInterpretation(editingItem.id, editingItem);
      if (res.success) {
        alert('Cập nhật luận giải thành công!');
        setEditingItem(null);
        loadData();
      }
    } catch (err: any) {
      alert(err?.message || 'Có lỗi khi lưu.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleVip = async (userId: string) => {
    try {
      const res = await adminApi.toggleVip(userId);
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi cập nhật VIP');
    }
  };

  const filteredInterpretations = interpretations.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.indicatorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.numberKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Tiêu đề Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Hệ Thống Quản Trị Trung Tâm
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white mt-1">
            Bảng Điều Khiển Quản Trị Viên (Admin)
          </h1>
          <p className="text-xs text-slate-400">
            Quản lý doanh thu VietQR, kho luận giải 26+ chỉ số, đơn hàng và thành viên VIP
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* 5 Thẻ Thống Kê Tổng Quan */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl glass-card border-purple-500/30">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Người Dùng</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-white mt-2 block">
              {stats.totalUsers}
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border-amber-500/30">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Thành Viên VIP</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-amber-300 mt-2 block">
              {stats.totalVipUsers}
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border-emerald-500/30">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Doanh Thu VietQR</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-2 block">
              {stats.totalRevenue.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border-indigo-500/30">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Đơn Hàng Mua VIP</span>
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-indigo-300 mt-2 block">
              {stats.totalOrders}
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border-pink-500/30 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Báo Cáo Đã Tạo</span>
              <FileText className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-pink-300 mt-2 block">
              {stats.totalReports}
            </span>
          </div>
        </div>
      )}

      {/* Tabs Quản Trị */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('STATS')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === 'STATS'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Tổng Quan Doanh Thu
        </button>
        <button
          onClick={() => setActiveTab('INTERPRETATIONS')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === 'INTERPRETATIONS'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Quản Lý Luận Giải ({interpretations.length})
        </button>
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === 'ORDERS'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Đơn Hàng VIP ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
            activeTab === 'USERS'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Người Dùng ({users.length})
        </button>
      </div>

      {/* TAB 1: TỔNG QUAN DOANH THU & GIAO DỊCH GẦN ĐÂY */}
      {activeTab === 'STATS' && stats && (
        <div className="glass-card rounded-2xl p-6 border border-purple-500/30 space-y-4">
          <h3 className="text-base font-bold text-slate-200">
            Lịch Sử Giao Dịch Gần Đây (Nhận Qua SePay Webhook)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="p-3">Mã Đơn Hàng</th>
                  <th className="p-3">Số Điện Thoại</th>
                  <th className="p-3">Số Tiền</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map(o => (
                    <tr key={o.orderCode} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-amber-300">{o.orderCode}</td>
                      <td className="p-3 font-mono">{o.phoneNumber}</td>
                      <td className="p-3 font-mono font-semibold text-emerald-400">
                        {o.amount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === 'Success'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(o.createdAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      Chưa có giao dịch đơn hàng nào được tạo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ KHO LUẬN GIẢI 26+ CHỈ SỐ */}
      {activeTab === 'INTERPRETATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm theo chỉ số, con số (VD: LIFE_PATH, 11)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>
            <span className="text-xs text-slate-400">
              Hiển thị {filteredInterpretations.length} nội dung
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredInterpretations.map(item => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/50 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30 font-bold">
                      {item.indicatorCode} - Số {item.numberKey}
                    </span>
                    {item.isVipOnly && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Khóa VIP
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Chỉnh sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ TẤT CẢ ĐƠN HÀNG */}
      {activeTab === 'ORDERS' && (
        <div className="glass-card rounded-2xl p-6 border border-purple-500/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="p-3">Mã Đơn</th>
                  <th className="p-3">Số Điện Thoại</th>
                  <th className="p-3">Gói VIP</th>
                  <th className="p-3">Số Tiền</th>
                  <th className="p-3">Nội Dung Chuyển Khoản</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3">Ngày Tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-amber-300">{o.orderCode}</td>
                    <td className="p-3 font-mono">{o.phoneNumber}</td>
                    <td className="p-3">{o.packageName}</td>
                    <td className="p-3 font-mono font-semibold text-emerald-400">
                      {o.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-3 font-mono text-purple-300">{o.transferContent}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === 'Success'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(o.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: QUẢN LÝ NGƯỜI DÙNG */}
      {activeTab === 'USERS' && (
        <div className="glass-card rounded-2xl p-6 border border-purple-500/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="p-3">Số Điện Thoại</th>
                  <th className="p-3">Họ Tên</th>
                  <th className="p-3">Vai Trò</th>
                  <th className="p-3">Trạng Thái VIP</th>
                  <th className="p-3">Hạn Dùng VIP</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-white">{u.phoneNumber}</td>
                    <td className="p-3">{u.fullName || '—'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-purple-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.isVip ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ★ Đã Nâng VIP
                        </span>
                      ) : (
                        <span className="text-slate-500">Thường</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">
                      {u.vipExpireAt ? new Date(u.vipExpireAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleVip(u.id)}
                        className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-purple-900 text-slate-200 hover:text-white transition cursor-pointer"
                      >
                        {u.isVip ? 'Thu hồi VIP' : 'Cấp VIP 1 Năm'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Luận Giải */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0926] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(147,51,234,0.3)] text-slate-100 my-8">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-cinzel text-amber-300 mb-4">
              Chỉnh Sửa Luận Giải: {editingItem.indicatorCode} - Số {editingItem.numberKey}
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">
                  Tiêu đề hiển thị:
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">
                  Đoạn tóm tắt ngắn:
                </label>
                <textarea
                  rows={2}
                  value={editingItem.summary}
                  onChange={e => setEditingItem({ ...editingItem, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">
                  Nội dung chi tiết (HTML):
                </label>
                <textarea
                  rows={6}
                  value={editingItem.contentHtml}
                  onChange={e => setEditingItem({ ...editingItem, contentHtml: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={editingItem.isVipOnly}
                  onChange={e => setEditingItem({ ...editingItem, isVipOnly: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isVip" className="text-slate-300 font-semibold cursor-pointer">
                  Khóa mục này (Chỉ dành cho tài khoản VIP)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
