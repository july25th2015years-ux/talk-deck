import React, { useState } from 'react';
import type { GeminiConfig, Topic } from '../types';
import { expandTopicWithGemini } from '../services/gemini';
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

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleApplyToCard = () => {
    if (result) {
      onAppendQuestions(result.newDepthQuestions, result.tailoredAdvice);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-200 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                AIで会話の切り口を広げる
              </h2>
              <p className="text-xs text-slate-400">
                相手の反応に応じた次の質問やアドバイスを提案
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

        {/* Current Topic Reference */}
        <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm">
          <span className="text-slate-500 text-[11px] block">現在の話題:</span>
          <span className="font-semibold text-white">「{topic.title}」</span>
        </div>

        {!config?.apiKey ? (
          <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-3">
            <Key className="w-8 h-8 text-indigo-400 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-white">Gemini APIキーが必要です</h3>
              <p className="text-xs text-slate-400 mt-1">
                AIによるリアルタイム深掘り提案にはGemini APIキーが必要です。
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              設定を開く
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <form onSubmit={handleExpand} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  相手の反応や状況（任意）
                </label>
                <input
                  type="text"
                  value={reactionNote}
                  onChange={(e) => setReactionNote(e.target.value)}
                  placeholder="例: 「あまり料理はしないと言われた」「旅行好きと判明した」など"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AIが次の切り返しを考案中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    次の切り返し・質問を提案してもらう
                  </>
                )}
              </button>
            </form>

            {/* Generated Results */}
            {result && (
              <div className="pt-3 border-t border-slate-800 space-y-3 animate-fade-in">
                <div>
                  <span className="text-xs font-semibold text-indigo-300 block mb-2">
                    💡 提案された次の質問:
                  </span>
                  <ul className="space-y-1.5">
                    {result.newDepthQuestions.map((q, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-start justify-between gap-2"
                      >
                        <span>
                          <strong className="text-indigo-400 mr-1.5">{idx + 1}.</strong>
                          {q}
                        </span>
                        <button
                          onClick={() => handleCopy(q, idx)}
                          className="p-1 text-slate-400 hover:text-white flex-shrink-0"
                          title="コピー"
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
                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200">
                    <strong className="text-indigo-300 block mb-1">🎯 アドバイス:</strong>
                    {result.tailoredAdvice}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleApplyToCard}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    この質問を現在のカード裏面に追加
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
