import React from 'react';
import type { Topic } from '../types';
import { CATEGORIES } from '../data/topics';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectTopic,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#131022] border-l border-white/15 shadow-2xl flex flex-col animate-slide-up text-slate-200 safe-top safe-bottom"
        style={{ backgroundColor: '#131022' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              保存したお気に入り ({favorites.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition flex items-center justify-center"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <Bookmark className="w-10 h-10 stroke-[1.5] text-slate-600" />
              <p className="text-sm font-medium text-slate-300">
                お気に入りはまだないよ
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                カード右上のブックマークを押すと、あとでもう一度話したい質問や盛り上がったお題を残しておけるよ。
              </p>
            </div>
          ) : (
            favorites.map((topic) => {
              const catMeta = CATEGORIES.find((c) => c.id === topic.category) || CATEGORIES[0];
              return (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-white/10 text-slate-200 flex items-center gap-1">
                      <span>{catMeta.emoji}</span>
                      <span>{catMeta.shortLabel}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(topic.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                      title="削除"
                      aria-label="お気に入りから削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed line-clamp-2">
                    {topic.title}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      深掘り質問: {topic.depthQuestions.length}件
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTopic(topic);
                        onClose();
                      }}
                      className="py-1 text-xs text-rose-300 hover:text-rose-200 font-medium flex items-center gap-1 transition"
                    >
                      このカードを開く
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('すべてのお気に入りを削除しますか？')) {
                  onClearAll();
                }
              }}
              className="min-h-[38px] text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              すべて削除
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[38px] px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
