import React, { useState } from 'react';
import type { Category, GeminiConfig, Topic } from '../types';
import { generateCustomTopicWithGemini } from '../services/gemini';
import { Wand2, X, Sparkles, Loader2, Key } from 'lucide-react';

interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GeminiConfig | null;
  onTopicGenerated: (topic: Topic) => void;
  onOpenSettings: () => void;
}

export const CustomTopicModal: React.FC<CustomTopicModalProps> = ({
  isOpen,
  onClose,
  config,
  onTopicGenerated,
  onOpenSettings,
}) => {
  const [scene, setScene] = useState('カフェ・ランチデート');
  const [themeCategory, setThemeCategory] = useState<Exclude<Category, 'all'>>('relationship');
  const [mood, setMood] = useState('本音や価値観をじっくり知りたい');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const themeLabels: Record<Exclude<Category, 'all'>, string> = {
    relationship: 'ふたりの関係・本音',
    'money-values': 'お金・リベシティ・価値観',
    lifestyle: '生活スタイル・相性',
    'past-inner': '過去・素の自分',
    future: 'これからの未来',
    intimacy: 'ドキッと・距離感とスキンシップ',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config?.apiKey) {
      setError('Gemini APIキーが設定されていません。設定からキーを入力してください。');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const topic = await generateCustomTopicWithGemini(
        {
          scene,
          categoryId: themeCategory,
          categoryLabel: themeLabels[themeCategory],
          mood,
          notes: notes.trim(),
        },
        config
      );
      onTopicGenerated(topic);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '話題の生成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain rounded-3xl bg-[#161328] border border-white/15 shadow-2xl p-5 sm:p-6 text-slate-200 animate-slide-up"
        style={{ backgroundColor: '#161328' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">AIでふたり向けのお題を作る</h2>
              <p className="text-xs text-slate-400">
                今の気分やキーワードから追加カードを1枚生成します
              </p>
            </div>
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

        {/* API Key Missing Warning */}
        {!config?.apiKey ? (
          <div className="mt-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-400/30 text-center space-y-3">
            <Key className="w-8 h-8 text-rose-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Google Gemini APIキーが必要です
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                AIによるカスタムお題作成を使うには、無料のGemini APIキー設定が必要です。（100問のデッキはAPIキーなしでそのまま遊べます）
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              設定画面を開いてキーを入力
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  今のシチュエーション
                </label>
                <select
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-base sm:text-sm text-white focus:border-rose-400 focus:outline-none"
                >
                  <option value="カフェ・ランチデート">カフェ・ランチデート</option>
                  <option value="お家デート・まったりタイム">お家デート・まったりタイム</option>
                  <option value="ドライブ・お散歩デート">ドライブ・お散歩デート</option>
                  <option value="夜の語らい・お酒を飲みながら">夜の語らい・お酒を飲みながら</option>
                  <option value="旅行・お泊まりデート">旅行・お泊まりデート</option>
                  <option value="電話・オンライン通話">電話・オンライン通話</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  話したいテーマ
                </label>
                <select
                  value={themeCategory}
                  onChange={(e) => setThemeCategory(e.target.value as Exclude<Category, 'all'>)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-base sm:text-sm text-white focus:border-rose-400 focus:outline-none"
                >
                  <option value="relationship">💕 ふたりの関係・本音</option>
                  <option value="money-values">🦁 お金・リベシティ・価値観</option>
                  <option value="lifestyle">🏡 生活スタイル・相性</option>
                  <option value="past-inner">🌙 過去・素の自分</option>
                  <option value="future">🚀 これからの未来</option>
                  <option value="intimacy">🔥 ドキッと・距離感</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                今の雰囲気・ねらい
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-base sm:text-sm text-white focus:border-rose-400 focus:outline-none"
              >
                <option value="本音や価値観をじっくり知りたい">本音や価値観をじっくり知りたい</option>
                <option value="楽しく笑いながら少し踏み込みたい">楽しく笑いながら少し踏み込みたい</option>
                <option value="2人の距離をぐっと縮めたい・ドキッとしたい">2人の距離をぐっと縮めたい・ドキッとしたい</option>
                <option value="お金や将来のことをフラットに話したい">お金や将来のことをフラットに話したい</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                入れたいキーワード（任意）
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例: 「来月の旅行」「価値観マップ」「同棲」など"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-base sm:text-sm text-white placeholder-slate-600 focus:border-rose-400 focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200">
                {error}
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-500/25 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    お題を作成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    カードを追加する
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
