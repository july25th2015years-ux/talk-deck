import React from 'react';
import { ArrowRight, RotateCw, ArrowLeft, Shuffle, RotateCcw } from 'lucide-react';

interface ActionButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  onFlip: () => void;
  isFlipped: boolean;
  seenCount: number;
  totalCount: number;
  onResetCycle?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNext,
  onPrev,
  canPrev,
  onFlip,
  isFlipped,
  seenCount,
  totalCount,
  onResetCycle,
}) => {
  const isFullRound = seenCount >= totalCount && totalCount > 0;
  const progressPercent = totalCount > 0 ? Math.min(100, Math.round((seenCount / totalCount) * 100)) : 0;

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-2 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        {/* Previous Topic Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className={`min-h-[46px] w-11 sm:w-12 flex-shrink-0 rounded-2xl border flex items-center justify-center transition-all ${
            canPrev
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border-white/15 hover:border-white/25 active:scale-95'
              : 'bg-slate-900/50 text-slate-600 border-white/5 cursor-not-allowed opacity-50'
          }`}
          title="1つ前の質問に戻る"
          aria-label="1つ前の質問に戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Flip Toggle Button */}
        <button
          type="button"
          onClick={onFlip}
          className="min-h-[46px] px-3 sm:px-4 py-2.5 flex-shrink-0 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-white/15 hover:border-white/25 flex items-center justify-center gap-1.5 font-medium text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap"
        >
          <RotateCw className="w-4 h-4 text-rose-300 flex-shrink-0" />
          <span className="sm:hidden">{isFlipped ? '質問へ' : '深掘り'}</span>
          <span className="hidden sm:inline">{isFlipped ? '質問を見る' : '深掘りヒント'}</span>
        </button>

        {/* Next Topic Button (Primary) */}
        <button
          type="button"
          onClick={onNext}
          className="min-h-[46px] flex-1 min-w-0 py-2.5 px-3 sm:px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:via-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-rose-600/25 active:scale-[0.98] transition-all"
        >
          <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">{isFullRound ? '1周完了！もう1周' : '次のカードを引く'}</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0 hidden sm:block" />
        </button>
      </div>

      {/* Cycle Progress Bar & Indicators */}
      <div className="w-full space-y-1.5 px-1">
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>
              話したカード: <strong className="text-rose-300 font-bold">{seenCount}</strong> / {totalCount} 問
            </span>
            <span className="text-slate-500 hidden sm:inline">
              （1周するまで重複なし）
            </span>
          </div>
          {seenCount > 1 && onResetCycle && (
            <button
              type="button"
              onClick={onResetCycle}
              className="py-1 text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              title="出題履歴をリセットして最初からシャッフル"
            >
              <RotateCcw className="w-3 h-3" />
              <span>履歴リセット</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
