"use client";

import React from "react";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface QuizNavigationButtonsProps {
  isLastQuestion: boolean;
  isNavigating: boolean;
  currentIdx: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export const QuizNavigationButtons: React.FC<QuizNavigationButtonsProps> = ({
  isLastQuestion,
  isNavigating,
  currentIdx,
  onNext,
  onPrev,
  onFinish,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6 w-full">
      {/* Next or Finish Button (on right in RTL) */}
      {isLastQuestion ? (
        <button
          type="button"
          onClick={onFinish}
          disabled={isNavigating}
          className="flex-1 sm:flex-none sm:min-w-40 flex items-center justify-center gap-2 py-3 px-7 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          {isNavigating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          <span>إنهاء الاختبار</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isNavigating}
          className="flex-1 sm:flex-none sm:min-w-40 flex items-center justify-center gap-2 py-3 px-7 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
        >
          {isNavigating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          <span>التالي</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}

      {/* Previous Button (on left in RTL) */}
      {currentIdx > 0 ? (
        <button
          type="button"
          onClick={onPrev}
          disabled={isNavigating}
          className="flex-1 sm:flex-none sm:min-w-35 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all cursor-pointer shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>السابق</span>
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};

export default QuizNavigationButtons;
