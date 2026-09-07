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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-up text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              保存したお気に入り ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <Bookmark className="w-10 h-10 stroke-[1.5] text-slate-600" />
              <p className="text-sm font-medium text-slate-400">
                お気に入りはまだありません
              </p>
              <p className="text-xs text-slate-500">
                カード右上にあるブックマークアイコンを押すと、気に入った話題をここに保存できます。
              </p>
            </div>
          ) : (
            favorites.map((topic) => {
              const catMeta = CATEGORIES.find((c) => c.id === topic.category) || CATEGORIES[0];
              return (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-700/60 text-slate-300 flex items-center gap-1">
                      <span>{catMeta.emoji}</span>
                      <span>{catMeta.label}</span>
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(topic.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2">
                    「{topic.title}」
                  </p>

                  <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      深掘りヒント: {topic.depthQuestions.length}件
                    </span>
                    <button
                      onClick={() => {
                        onSelectTopic(topic);
                        onClose();
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
                    >
                      カードにセット
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('すべてのお気に入りを削除しますか？')) {
                  onClearAll();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              すべて削除
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
