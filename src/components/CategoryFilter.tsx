import React from 'react';
import { CATEGORIES } from '../data/topics';
import type { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  countsByCategory: Record<Category, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  countsByCategory,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-1 sm:py-2">
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = countsByCategory[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`min-h-[36px] px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 border active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-rose-300/60 shadow-md shadow-rose-500/25'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="sm:hidden">{cat.shortLabel}</span>
              <span className="hidden sm:inline">{cat.id === 'all' ? 'すべて' : cat.label}</span>
              <span
                className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full leading-none ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
