import React from 'react';
import { Home, Search, QrCode, Shield } from 'lucide-react';
import { Category } from '../types';

interface BottomNavProps {
  activeView: 'home' | 'venue-detail' | 'admin';
  onNavigateHome: () => void;
  onOpenVouchers: () => void;
  onOpenAdmin: () => void;
  pendingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onNavigateHome,
  onOpenVouchers,
  onOpenAdmin,
  pendingCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 py-2 px-4 shadow-2xl">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeView === 'home' || activeView === 'venue-detail'
              ? 'text-emerald-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Bosh sahifa</span>
        </button>

        {/* Search / Discover */}
        <button
          onClick={onNavigateHome}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 transition-all"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Qidiruv</span>
        </button>

        {/* My Vouchers */}
        <button
          onClick={onOpenVouchers}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 transition-all"
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px]">Vaucherlarim</span>
        </button>

        {/* Admin */}
        <button
          onClick={onOpenAdmin}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeView === 'admin'
              ? 'text-emerald-400 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          )}
        </button>

      </div>
    </div>
  );
};
