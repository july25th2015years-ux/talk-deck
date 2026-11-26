import React, { useState } from 'react';
import type { Topic } from '../types';
import { CATEGORIES } from '../data/topics';
import { copyToClipboard } from '../utils/clipboard';
import {
  RotateCw,
  Bookmark,
  Copy,
  Check,
  Lightbulb,
  Compass,
  HeartHandshake,
  Sparkles,
  Wand2,
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

  const handleCopy = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 1800);
    }
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: 'Lv.1 ちょっと踏み込む',
          color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
        };
      case 2:
        return {
          label: 'Lv.2 本音・価値観',
          color: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
        };
      case 3:
        return {
          label: 'Lv.3 ディープ・未来',
          color: 'bg-rose-500/20 text-rose-200 border-rose-400/35',
        };
      default:
        return {
          label: `Lv.${level}`,
          color: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        };
    }
  };

  const levelBadge = getLevelBadge(topic.level);

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center">
      <div className="w-full min-h-[340px] sm:min-h-[390px] rounded-3xl bg-gradient-to-b from-[#1a152e] via-[#141126] to-[#0f0d1c] border border-white/15 shadow-2xl shadow-purple-950/40 p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-rose-400/30">
        {!isFlipped ? (
          /* ===================== CARD FRONT ===================== */
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onFlip();
              }
            }}
            className="flex-1 flex flex-col justify-between cursor-pointer select-none animate-fade-in outline-none"
            onClick={onFlip}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span
                  className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1 ${categoryMeta.badgeBg}`}
                >
                  <span>{categoryMeta.emoji}</span>
                  <span>{categoryMeta.label}</span>
                </span>
                <span
                  className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium border ${levelBadge.color}`}
                >
                  {levelBadge.label}
                </span>
                {topic.isCustom && (
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 font-medium border border-purple-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI生成
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={(e) => handleCopy(topic.title, e)}
                  className="min-h-[38px] min-w-[38px] p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition flex items-center justify-center border border-white/10"
                  title="質問をコピー"
                  aria-label="質問をコピー"
                >
                  {copiedText === topic.title ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`min-h-[38px] min-w-[38px] p-2 rounded-xl transition active:scale-95 flex items-center justify-center border ${
                    isFavorite
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                  }`}
                  title={isFavorite ? 'お気に入りから削除' : 'お気に入りに保存'}
                  aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに保存'}
                >
                  <Bookmark className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Main Topic Question */}
            <div className="my-auto py-7 sm:py-9 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-rose-300/80 font-semibold mb-3">
                Couple Talk Card
              </p>
              <h2 className="text-lg sm:text-2xl md:text-[26px] font-bold text-white leading-relaxed tracking-wide drop-shadow-sm px-1">
                {topic.title}
              </h2>
              <p className="mt-4 text-[11px] sm:text-xs text-slate-400">
                お互いに交代で答えてみてね
              </p>
            </div>

            {/* Bottom Flip Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3.5 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                タップして深掘り質問・コツを見る
              </span>
              <span className="hidden sm:inline text-slate-500 text-[11px]">
                Space: 次へ / Enter: 裏面
              </span>
            </div>
          </div>
        ) : (
          /* ===================== CARD BACK ===================== */
          <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
            {/* Back Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
              <span className="text-xs font-semibold tracking-wide text-rose-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                もっと話すための深掘りヒント
              </span>
              <button
                type="button"
                onClick={onFlip}
                className="min-h-[34px] text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 active:scale-95 text-slate-200 flex items-center gap-1 border border-white/10 transition flex-shrink-0"
              >
                <RotateCw className="w-3 h-3" />
                質問に戻る
              </button>
            </div>

            {/* Back Content */}
            <div className="space-y-3.5 my-auto py-3">
              {/* Depth Questions */}
              <div>
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Compass className="w-3.5 h-3.5 text-rose-400" />
                  続けて聞いてみたい深掘り質問:
                </p>
                <ul className="space-y-2">
                  {topic.depthQuestions.map((q, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm bg-white/5 hover:bg-white/10 rounded-xl p-2.5 sm:p-3 text-slate-100 border border-white/10 flex items-start justify-between gap-2 group transition"
                    >
                      <span className="leading-relaxed">
                        <span className="text-rose-400 font-bold mr-1.5">{idx + 1}.</span>
                        {q}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(q, e)}
                        className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition p-1.5 -m-1 text-slate-400 hover:text-white flex-shrink-0"
                        title="質問をコピー"
                        aria-label="深掘り質問をコピー"
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
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-400/20 text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                <span className="font-semibold text-purple-200 block mb-1">💬 盛り上がるコツ:</span>
                {topic.expansionTips}
              </div>

              {/* Caution Advice */}
              {topic.cautionTips && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-rose-950/30 border border-rose-400/20 text-xs text-rose-100/85 leading-relaxed flex items-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-rose-200">大切にしたいポイント:</strong> {topic.cautionTips}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Back Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={onFlip}
                className="min-h-[36px] text-xs text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <span>&larr; 質問カードに戻る</span>
              </button>

              {onOpenAiExpand && (
                <button
                  type="button"
                  onClick={onOpenAiExpand}
                  className="min-h-[36px] text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 active:scale-95 text-white font-medium flex items-center gap-1.5 shadow-sm transition"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  AIでさらに広げる
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
