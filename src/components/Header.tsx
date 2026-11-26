import React from 'react';
import { Heart, Settings, Bookmark, Wand2 } from 'lucide-react';

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
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-5 flex items-center justify-between gap-2 border-b border-white/10">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-rose-500/25 flex-shrink-0">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/90" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent flex items-center gap-1.5 sm:gap-2">
            <span className="truncate">TalkDeck</span>
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 font-medium border border-rose-400/30 whitespace-nowrap flex-shrink-0">
              ふたりの100問
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 truncate">
            <span className="sm:hidden">付き合って2ヶ月のトークデッキ</span>
            <span className="hidden sm:inline">付き合って2ヶ月、もっと深く知り合うトークデッキ</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenCustomTopic}
          className="min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs sm:text-sm font-medium transition border border-slate-700/80 hover:border-slate-600"
          title="AIでふたり向けのお題を追加"
          aria-label="AIお題生成"
        >
          <Wand2 className="w-4 h-4 text-purple-300" />
          <span className="hidden sm:inline">AIお題</span>
        </button>

        <button
          type="button"
          onClick={onOpenFavorites}
          className="relative min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs sm:text-sm font-medium transition border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-1.5"
          title="お気に入り一覧"
          aria-label="お気に入り一覧"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">保存</span>
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 sm:static bg-amber-400 text-slate-950 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 leading-none rounded-full min-w-[18px] text-center">
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className={`min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] p-2 rounded-xl text-sm font-medium transition border active:scale-95 flex items-center justify-center ${
            hasApiKey
              ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/80 text-slate-200'
              : 'bg-rose-950/50 hover:bg-rose-900/50 border-rose-500/35 text-rose-200'
          }`}
          title="Gemini API設定"
          aria-label="設定"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
