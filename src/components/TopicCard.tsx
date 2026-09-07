import React, { useState } from 'react';
import type { Topic } from '../types';
import { CATEGORIES } from '../data/topics';
import { 
  RotateCw, 
  Bookmark, 
  Copy, 
  Check, 
  Lightbulb, 
  Compass, 
  AlertTriangle, 
  Sparkles,
  Wand2
} from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  isFlipped: boolean;
  onFlip: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenAiExpand?: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isFlipped,
  onFlip,
  isFavorite,
  onToggleFavorite,
  onOpenAiExpand,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const categoryMeta = CATEGORIES.find((c) => c.id === topic.category) || CATEGORIES[0];

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return { label: 'Lv.1 初対面・安心', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 2:
        return { label: 'Lv.2 打ち解け', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 3:
        return { label: 'Lv.3 親密・ディープ', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
      default:
        return { label: `Lv.${level}`, color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  const levelBadge = getLevelBadge(topic.level);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 min-h-[400px] flex items-center justify-center">
      <div
        className="w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-slate-600"
        style={{ minHeight: '380px' }}
      >
        {!isFlipped ? (
          /* ===================== CARD FRONT ===================== */
          <div 
            className="flex-1 flex flex-col justify-between cursor-pointer select-none animate-fade-in"
            onClick={onFlip}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1 ${categoryMeta.badgeBg}`}>
                  <span>{categoryMeta.emoji}</span>
                  <span>{categoryMeta.label}</span>
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${levelBadge.color}`}>
                  {levelBadge.label}
                </span>
                {topic.isCustom && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI生成
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleCopy(topic.title, e)}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="話題をコピー"
                >
                  {copiedText === topic.title ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`p-2 rounded-lg transition ${
                    isFavorite
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                >
                  <Bookmark className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Main Topic Question */}
            <div className="my-auto py-8 text-center">
              <p className="text-xs uppercase tracking-widest text-indigo-400/80 font-semibold mb-3">
                Conversation Cue
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed tracking-wide drop-shadow-sm px-2">
                「{topic.title}」
              </h2>
            </div>

            {/* Bottom Flip Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium group hover:text-indigo-300">
                <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                タップして深掘り質問・コツを見る
              </span>
              <span className="hidden sm:inline text-slate-500 text-[11px]">
                Space: 次へ / Enter: ヒント表示
              </span>
            </div>
          </div>
        ) : (
          /* ===================== CARD BACK ===================== */
          <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
            {/* Back Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                深掘りヒント＆広げ方のコツ
              </span>
              <button
                onClick={onFlip}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700 transition"
              >
                <RotateCw className="w-3 h-3" />
                表に戻る
              </button>
            </div>

            {/* Back Content */}
            <div className="space-y-4 my-auto py-3">
              {/* Depth Questions */}
              <div>
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  次に聞く深掘り質問（例）:
                </p>
                <ul className="space-y-1.5">
                  {topic.depthQuestions.map((q, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm bg-slate-800/60 hover:bg-slate-800 rounded-lg p-2.5 text-slate-200 border border-slate-700/60 flex items-start justify-between gap-2 group transition"
                    >
                      <span className="leading-relaxed">
                        <span className="text-indigo-400 font-bold mr-1.5">{idx + 1}.</span>
                        {q}
                      </span>
                      <button
                        onClick={(e) => handleCopy(q, e)}
                        className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-white"
                        title="質問をコピー"
                      >
                        {copiedText === q ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expansion Advice */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                <span className="font-semibold text-indigo-300 block mb-1">🎯 広げ方のアドバイス:</span>
                {topic.expansionTips}
              </div>

              {/* Caution Advice */}
              {topic.cautionTips && (
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/80 leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">注意点:</strong> {topic.cautionTips}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Back Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onFlip}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              >
                <span>&larr; 表（話題）に戻る</span>
              </button>

              {onOpenAiExpand && (
                <button
                  onClick={onOpenAiExpand}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium flex items-center gap-1.5 shadow-sm transition"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  AIでさらに切り口を広げる
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
