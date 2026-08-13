import React from 'react';
import { Category } from '../types';
import { Sparkles, Trophy, Hotel as HotelIcon, Scissors, Gamepad2 } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const CATEGORIES: { id: Category | 'All'; label: string; icon: React.ReactNode }[] = [
  { id: 'All', label: 'Barchasi', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'Stadion', label: 'Stadion', icon: <Trophy className="w-4 h-4" /> },
  { id: 'Hotel', label: 'Mehmonxona', icon: <HotelIcon className="w-4 h-4" /> },
  { id: 'Barber', label: 'Sartaroshxona', icon: <Scissors className="w-4 h-4" /> },
  { id: 'PS Club', label: 'PS Klub', icon: <Gamepad2 className="w-4 h-4" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02] border border-emerald-300/40'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className={isActive ? 'text-slate-950' : 'text-emerald-400'}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
