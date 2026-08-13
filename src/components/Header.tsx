import React from 'react';
import { Shield, Search, QrCode, MapPin } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onOpenAdmin: () => void;
  onOpenVouchers: () => void;
  pendingCount: number;
}

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg'ona"];

export const Header: React.FC<HeaderProps> = ({
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  onOpenAdmin,
  onOpenVouchers,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Top row: Logo, Admin, Vouchers */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo */}
          <button
            onClick={() => onSelectCategory('All')}
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              🤝
            </span>
            <div className="flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                Gaplashib Qo'ydim
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                v2.0
              </span>
            </div>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVouchers}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <QrCode className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Vaucherlarim</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="relative flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
              {pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-slate-950 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: Search input & City selector */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Stadion, restoran, hotel qidirish..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-100 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-slate-950 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* City Select */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-8 text-xs font-bold text-slate-200 outline-none transition focus:border-emerald-500 cursor-pointer appearance-none"
            >
              <option value="Barcha shaharlar">Barcha shaharlar</option>
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </header>
  );
};
