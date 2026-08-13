import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  activeCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const CATEGORIES: { id: Category | 'All'; label: string; icon: string; badge?: string }[] = [
  { id: 'All', label: 'Barchasi', icon: '✨' },
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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
