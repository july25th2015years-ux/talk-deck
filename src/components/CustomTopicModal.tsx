import React, { useState } from 'react';
import type { GeminiConfig, Topic } from '../types';
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
  const [category, setCategory] = useState('職場・仕事');
  const [relationship, setRelationship] = useState('先輩・上司');
  const [mood, setMood] = useState('緊張をほぐしたい・アイスブレイク');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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
          category,
          relationship,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-200 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AIオーダーメイド話題生成</h2>
              <p className="text-xs text-slate-400">
                相手の状況に合わせてGeminiが最適なネタを提案します
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Missing Warning */}
        {!config?.apiKey ? (
          <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-3">
            <Key className="w-8 h-8 text-indigo-400 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Google Gemini APIキーが必要です
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                AIオーダーメイド話題生成をご利用いただくには、無料のGemini APIキーの設定が必要です。
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              設定画面を開いてキーを入力
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  シチュエーション
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="職場・オフィス">職場・オフィス</option>
                  <option value="初対面・名刺交換">初対面・名刺交換</option>
                  <option value="飲み会・懇親会">飲み会・懇親会</option>
                  <option value="デート・お出かけ">デート・お出かけ</option>
                  <option value="オンライン会議・雑談">オンライン会議・雑談</option>
                  <option value="友人・プライベート">友人・プライベート</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  相手との関係性
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="先輩・上司">先輩・上司</option>
                  <option value="同僚・同期">同僚・同期</option>
                  <option value="後輩・部下">後輩・部下</option>
                  <option value="初対面の取引先・知人">初対面の取引先・知人</option>
                  <option value="気になる人・デート相手">気になる人・デート相手</option>
                  <option value="親しい友人">親しい友人</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                会話の目的・場の雰囲気
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="緊張をほぐしたい・アイスブレイク">緊張をほぐしたい・アイスブレイク</option>
                <option value="自然に盛り上がりたい・笑いたい">自然に盛り上がりたい・笑いたい</option>
                <option value="相手の価値観や本音を深く知りたい">相手の価値観や本音を深く知りたい</option>
                <option value="気まずい沈黙をさりげなく解消したい">気まずい沈黙をさりげなく解消したい</option>
                <option value="好印象を持たれたい・距離を縮めたい">好印象を持たれたい・距離を縮めたい</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                相手の情報やキーワード（任意）
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例: 「最近犬を飼い始めた」「甘いものが好き」「旅行帰り」など"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AIが話題を考案中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    オーダーメイド生成
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
