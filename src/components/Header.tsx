import React from 'react';
import { Sparkles, Settings, Bookmark, Wand2 } from 'lucide-react';

interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  onOpenCustomTopic: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  onOpenSettings,
  onOpenCustomTopic,
  hasApiKey,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
            TalkDeck
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            気まずい沈黙をゼロにする雑談＆深掘りアシスタント
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCustomTopic}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition border border-slate-700 hover:border-slate-600"
          title="AIオーダーメイド話題作成"
        >
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">AIお題生成</span>
        </button>

        <button
          onClick={onOpenFavorites}
          className="relative p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition border border-slate-700 hover:border-slate-600 flex items-center gap-1.5"
          title="お気に入り一覧"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">保存</span>
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 sm:static bg-amber-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-lg text-slate-200 text-sm font-medium transition border ${
            hasApiKey
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
              : 'bg-indigo-950/60 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-300'
          }`}
          title="API設定"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
