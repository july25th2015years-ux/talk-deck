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

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-3 w-full">
        {/* Previous Topic Button */}
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${
            canPrev
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600 active:scale-95'
              : 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed opacity-50'
          }`}
          title="1つ前の話題に戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Flip Toggle Button */}
        <button
          onClick={onFlip}
          className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 font-medium text-sm transition-all active:scale-95"
        >
          <RotateCw className="w-4 h-4 text-indigo-400" />
          <span>{isFlipped ? '表（話題）へ' : '深掘りヒント'}</span>
        </button>

        {/* Next Topic Button (Primary) */}
        <button
          onClick={onNext}
          className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
        >
          <Shuffle className="w-5 h-5" />
          <span>{isFullRound ? '1周完了！リシャッフル' : '次のカードを引く'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cycle Progress Bar & Indicators */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span>
            出題済み: <strong className="text-indigo-400 font-bold">{seenCount}</strong> / {totalCount} 問
          </span>
          <span className="text-slate-500 hidden sm:inline">
            （1周するまで重複なし）
          </span>
        </div>
        {seenCount > 1 && onResetCycle && (
          <button
            onClick={onResetCycle}
            className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
            title="出題履歴をリセットして最初からシャッフル"
          >
            <RotateCcw className="w-3 h-3" />
            <span>シャッフル初期化</span>
          </button>
        )}
      </div>
    </div>
  );
};
