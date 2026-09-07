import React from 'react';
import type { IntimacyLevel } from '../types';
import { ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

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
    sub: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'all',
      label: '全レベル',
      sub: 'おまかせ',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: 'text-slate-300',
    },
    {
      id: 1,
      label: 'Lv.1 初対面・安心',
      sub: '誰とでも無難に話せる',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'text-emerald-400',
    },
    {
      id: 2,
      label: 'Lv.2 打ち解け',
      sub: '人となりや価値観を知る',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />,
      color: 'text-amber-400',
    },
    {
      id: 3,
      label: 'Lv.3 親密・ディープ',
      sub: '深い話や笑えるエピソード',
      icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
          親密度:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => onSelectLevel(lvl.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center justify-between border ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500/60 shadow-sm text-white'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {lvl.icon}
                  <span className="truncate">{lvl.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
