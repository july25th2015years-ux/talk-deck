import React from 'react';
import type { IntimacyLevel } from '../types';
import { Sparkles, MessageCircleHeart, Flame, Layers } from 'lucide-react';

interface LevelFilterProps {
  selectedLevel: IntimacyLevel | 'all';
  onSelectLevel: (lvl: IntimacyLevel | 'all') => void;
}

export const LevelFilter: React.FC<LevelFilterProps> = ({
  selectedLevel,
  onSelectLevel,
}) => {
  const levels: {
    id: IntimacyLevel | 'all';
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'all',
      label: '全レベル',
      icon: <Layers className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />,
    },
    {
      id: 1,
      label: 'Lv.1 ちょっと踏み込む',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />,
    },
    {
      id: 2,
      label: 'Lv.2 本音・価値観',
      icon: <MessageCircleHeart className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />,
    },
    {
      id: 3,
      label: 'Lv.3 ディープ・未来',
      icon: <Flame className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap hidden md:inline">
          深さ:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`min-h-[38px] px-2.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center border active:scale-95 ${
                  isSelected
                    ? 'bg-white/10 border-rose-400/60 shadow-sm text-white'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  {lvl.icon}
                  <span>{lvl.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
