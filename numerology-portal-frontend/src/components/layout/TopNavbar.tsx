import React, { useState } from 'react';
import { Sparkles, Crown, User, ShieldAlert, Menu, X, BookOpen, Compass, Brain, Moon, Baby } from 'lucide-react';
import type { UserAccountDto } from '../../types/user.types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccountDto | null;
  onOpenLogin: () => void;
  onOpenUpgradeVip: () => void;
  onLogout: () => void;
}

export const TopNavbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onOpenUpgradeVip,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'numerology', label: 'Thần Số Học', icon: Sparkles },
    { id: 'numerology-kid', label: 'Thần Số Học Cho Con', icon: Baby },
    { id: 'disc', label: 'Trắc Nghiệm DISC', icon: Compass },
    { id: 'mbti', label: 'Trắc Nghiệm MBTI', icon: Brain },
    { id: 'astrology', label: 'Tử Vi & Bản Đồ Sao', icon: Moon },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-40 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div
            onClick={() => setActiveTab('numerology')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0720] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-purple-200 via-white to-amber-300 bg-clip-text text-transparent block">
                THẦN SỐ HỌC
              </span>
              <span className="text-[10px] text-purple-300/70 tracking-widest uppercase block -mt-1 font-mono">
                Cổng Tra Cứu Đa Dịch Vụ
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-purple-900/60 text-amber-300 border border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-purple-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Nút Mở Khóa VIP */}
            <button
              onClick={onOpenUpgradeVip}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950 fill-current" />
              {currentUser?.isVip ? 'Tài Khoản VIP' : 'Nâng Cấp VIP'}
            </button>

            {/* Nút Admin */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-950 text-amber-300 border-amber-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
              }`}
              title="Quản trị hệ thống"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Tài khoản / Đăng nhập */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-200 block">
                    {currentUser.fullName || currentUser.phoneNumber}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono block">
                    {currentUser.isVip ? '★ Thành viên VIP' : 'Thành viên thường'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 text-xs"
                  title="Đăng xuất"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4 text-purple-400" />
                Đăng Nhập
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenUpgradeVip}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5" /> VIP
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-500/20 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-purple-900/60 text-amber-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-400" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 py-1"
            >
              <ShieldAlert className="w-4 h-4" /> Quản Trị Hệ Thống
            </button>

            {currentUser ? (
              <button
                onClick={onLogout}
                className="text-xs text-rose-400 font-semibold"
              >
                Đăng Xuất ({currentUser.phoneNumber})
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-purple-400 font-semibold"
              >
                Đăng Nhập SĐT
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
