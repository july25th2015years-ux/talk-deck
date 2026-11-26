import React, { useState } from 'react';
import type { GeminiConfig, Topic } from '../types';
import { expandTopicWithGemini } from '../services/gemini';
import { copyToClipboard } from '../utils/clipboard';
import { Wand2, X, Sparkles, Loader2, Copy, Check, Key } from 'lucide-react';

interface AiExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic;
  config: GeminiConfig | null;
  onOpenSettings: () => void;
  onAppendQuestions: (newQuestions: string[], newAdvice: string) => void;
}

export const AiExpandModal: React.FC<AiExpandModalProps> = ({
  isOpen,
  onClose,
  topic,
  config,
  onOpenSettings,
  onAppendQuestions,
}) => {
  const [reactionNote, setReactionNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    newDepthQuestions: string[];
    tailoredAdvice: string;
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleExpand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config?.apiKey) {
      setError('Gemini APIキーが設定されていません。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await expandTopicWithGemini(topic, reactionNote, config);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '生成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleApplyToCard = () => {
    if (result) {
      onAppendQuestions(result.newDepthQuestions, result.tailoredAdvice);
      onClose();
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
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                AIでさらに深掘りする
              </h2>
              <p className="text-xs text-slate-400">
                ふたりの会話の流れに合わせて次の質問を提案します
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

        {/* Current Topic Reference */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs sm:text-sm">
          <span className="text-slate-400 text-[11px] block mb-0.5">現在の質問:</span>
          <span className="font-semibold text-white">{topic.title}</span>
        </div>

        {!config?.apiKey ? (
          <div className="mt-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-400/30 text-center space-y-3">
            <Key className="w-8 h-8 text-rose-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-white">Gemini APIキーが必要です</h3>
              <p className="text-xs text-slate-300 mt-1">
                AIによるリアルタイム深掘り提案にはGemini APIキーの設定が必要です。
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
              設定を開く
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <form onSubmit={handleExpand} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ここまでの会話の流れやキーワード（任意）
                </label>
                <input
                  type="text"
                  value={reactionNote}
                  onChange={(e) => setReactionNote(e.target.value)}
                  placeholder="例: 「お互い投資スタンスが少し違った」「旅行の話で盛り上がった」など"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-base sm:text-sm text-white placeholder-slate-600 focus:border-rose-400 focus:outline-none"
                />
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="min-h-[44px] w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    次の深掘り質問を考案中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    追加の深掘り質問を提案してもらう
                  </>
                )}
              </button>
            </form>

            {/* Generated Results */}
            {result && (
              <div className="pt-3 border-t border-white/10 space-y-3 animate-fade-in">
                <div>
                  <span className="text-xs font-semibold text-rose-300 block mb-2">
                    💡 提案された次の質問:
                  </span>
                  <ul className="space-y-1.5">
                    {result.newDepthQuestions.map((q, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-2"
                      >
                        <span className="leading-relaxed">
                          <strong className="text-rose-400 mr-1.5">{idx + 1}.</strong>
                          {q}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(q, idx)}
                          className="p-1.5 -m-1 text-slate-400 hover:text-white flex-shrink-0"
                          title="コピー"
                          aria-label="コピー"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.tailoredAdvice && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-400/20 text-xs sm:text-sm text-purple-100">
                    <strong className="text-purple-200 block mb-1">💬 アドバイス:</strong>
                    {result.tailoredAdvice}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleApplyToCard}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    この質問をカード裏面に追加
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
