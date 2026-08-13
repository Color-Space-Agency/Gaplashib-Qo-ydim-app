import React from 'react';
import { CalendarCheck, Shield, Sparkles, Search, QrCode } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdmin: () => void;
  onOpenVouchers: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  onOpenVouchers,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => onSelectCategory('All')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Gaplashib Qo'ydim
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">O'zbekiston bo'yicha tezkor onlayn band qilish</p>
            </div>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Stadion, Mehmonxona, Sartaroshxona, PS klub izlash..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* My Vouchers button */}
            <button
              onClick={onOpenVouchers}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition-all hover:border-slate-600 active:scale-95"
              title="Mening vaucherlarim"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Vaucherlarim</span>
            </button>

            {/* Admin Panel button */}
            <button
              onClick={onOpenAdmin}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all hover:shadow-emerald-500/40 active:scale-95"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
              {pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-extrabold text-white ring-2 ring-slate-900 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Search bar - Mobile */}
        <div className="mt-3 md:hidden relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Joy yoki xizmatlarni izlang..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>
    </header>
  );
};
