"use client";

import React from "react";
import { Check, X } from "lucide-react";
import type { AnswerCheckResult } from "../types";

interface QuizOptionProps {
  index: number;
  text: string;
  isSelected: boolean;
  checkResult: AnswerCheckResult | null;
  isDisabled: boolean;
  onSelect: (text: string) => void;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  index,
  text,
  isSelected,
  checkResult,
  isDisabled,
  onSelect,
}) => {
  const isChecked = checkResult !== null;
  const isCorrect = checkResult?.isCorrect ?? false;
  const isWrong = isSelected && isChecked && !isCorrect;
  const isCorrectResult = isSelected && isChecked && isCorrect;
  const isCorrectAnswer = !isSelected && isChecked && checkResult?.correctAnswer === text;

  let containerClass =
    "w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-4 text-right transition-all duration-200 select-none group cursor-pointer ";

  if (isCorrectResult) {
    // User picked the correct answer
    containerClass += " bg-[#ECFDF5] border-2 border-[#10B981] text-[#065F46] shadow-xs";
  } else if (isWrong) {
    // User picked the WRONG answer
    containerClass += " bg-[#FEF2F2] border-2 border-[#EF4444] text-[#991B1B] shadow-xs";
  } else if (isCorrectAnswer) {
    // This is the correct answer, but user didn't pick it
    containerClass += " bg-[#F0FDF4] border-2 border-[#86EFAC] text-[#166534] border-dashed";
  } else if (isSelected) {
    // Selected state
    containerClass +=
      " bg-[#FAF8FF] border-2 border-[#7939E3] text-[#1E1B4B] shadow-xs";
  } else if (isDisabled) {
    // Other options disabled after check
    containerClass +=
      " bg-white/60 border border-slate-100 text-slate-400 cursor-not-allowed";
  } else {
    // Default interactive state
    containerClass +=
      " bg-white border border-slate-100/90 text-slate-700 hover:border-purple-200 hover:bg-purple-50/20 active:scale-[0.995] shadow-[0_2px_8px_rgba(0,0,0,0.02)]";
  }

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(text)}
      disabled={isDisabled}
      className={containerClass}
      aria-label={`خيار ${index + 1}: ${text}`}
    >
      {/* Right: Option Text */}
      <span className="text-sm sm:text-base font-bold leading-relaxed text-right flex-1">
        {text}
      </span>

      {/* Left: Number / Status Badge */}
      <div className="flex items-center gap-2 shrink-0">
        {isChecked && (
          <div className="text-xs font-extrabold px-2 py-0.5 rounded-full">
            {isCorrectResult && (
              <span className="text-[#059669] bg-[#D1FAE5] px-2.5 py-1 rounded-full">
                صحيحة ✓
              </span>
            )}
            {isWrong && (
              <span className="text-[#DC2626] bg-[#FEE2E2] px-2.5 py-1 rounded-full">
                غير صحيحة ✗
              </span>
            )}
            {isCorrectAnswer && (
              <span className="text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                الإجابة الصحيحة ✓
              </span>
            )}
          </div>
        )}

        {/* Option Number or Check/Cross Circle */}
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
            isCorrectResult
              ? "bg-[#10B981] text-white"
              : isWrong
              ? "bg-[#EF4444] text-white"
              : isCorrectAnswer
              ? "bg-[#22C55E] text-white"
              : isSelected
              ? "bg-[#7939E3] text-white"
              : "bg-[#F1F5F9] text-slate-500 group-hover:bg-purple-100 group-hover:text-[#7939E3]"
          }`}
        >
          {isCorrectResult || isCorrectAnswer ? (
            <Check className="w-4 h-4" />
          ) : isWrong ? (
            <X className="w-4 h-4" />
          ) : (
            index + 1
          )}
        </span>
      </div>
    </button>
  );
};

export default QuizOption;
