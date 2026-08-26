"use client";

import React from "react";
import Image from "next/image";
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

  let containerClass =
    "w-full flex items-center gap-4 rounded-2xl px-5 sm:px-6 py-4 text-right transition-all duration-200 select-none group cursor-pointer ";

  if (isCorrectResult) {
    // User picked the correct answer (Green border + background)
    containerClass += " bg-[#ECFDF5] border-2 border-[#10B981] text-[#1E1B4B] shadow-xs";
  } else if (isWrong) {
    // User picked the wrong answer (Red border + background)
    containerClass += " bg-[#FEF2F2] border-2 border-[#EF4444] text-[#1E1B4B] shadow-xs";
  } else if (isSelected) {
    // Selected state before check
    containerClass += " bg-[#FAF8FF] border-2 border-[#7939E3] text-[#1E1B4B] shadow-xs";
  } else if (isDisabled) {
    // Other options disabled after check (remain clean neutral cards)
    containerClass += " bg-white border border-slate-100 text-slate-700 cursor-not-allowed opacity-90 shadow-[0_2px_8px_rgba(0,0,0,0.02)]";
  } else {
    // Default interactive state
    containerClass +=
      " bg-white border border-slate-100 text-slate-700 hover:border-purple-200 hover:bg-purple-50/20 active:scale-[0.995] shadow-[0_2px_8px_rgba(0,0,0,0.02)]";
  }

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(text)}
      disabled={isDisabled}
      className={containerClass}
      aria-label={`خيار ${index + 1}: ${text}`}
    >
      {/* 1. Right Side (Start in RTL): Number or Custom Check/Cross Image */}
      <div className="flex items-center justify-center shrink-0">
        {isCorrectResult ? (
          <Image
            src="/iamges/q-check-mark.png"
            alt="صح"
            width={32}
            height={32}
            style={{ width: "auto", height: "auto" }}
            className="drop-shadow-xs"
          />
        ) : isWrong ? (
          <Image
            src="/iamges/q-check-mark-cross.png"
            alt="خطأ"
            width={32}
            height={32}
            style={{ width: "auto", height: "auto" }}
            className="drop-shadow-xs"
          />
        ) : (
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              isSelected
                ? "bg-[#7939E3] text-white shadow-xs"
                : "bg-[#F3E8FF] text-[#7939E3] group-hover:bg-[#E9D5FF]"
            }`}
          >
            {index + 1}
          </span>
        )}
      </div>

      {/* 2. Left Side: Option Text */}
      <span className="text-sm sm:text-base font-bold leading-relaxed text-right flex-1">
        {text}
      </span>
    </button>
  );
};

export default QuizOption;
