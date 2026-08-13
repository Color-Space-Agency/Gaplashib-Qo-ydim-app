import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  activeCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const CATEGORIES: { id: Category | 'All'; label: string; icon: string; count?: string }[] = [
  { id: 'All', label: 'Barcha xizmatlar', icon: '✨' },
  { id: 'Stadion', label: 'Stadion', icon: '⚽' },
  { id: 'Hotel', label: 'Mehmonxona', icon: '🏨' },
  { id: 'Barber', label: 'Sartaroshxona', icon: '💈' },
  { id: 'PS Club', label: 'PS Klub', icon: '🎮' },
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
            className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02] border border-emerald-300/40'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="text-base sm:text-lg">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
