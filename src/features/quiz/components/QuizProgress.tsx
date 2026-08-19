"use client";

import React from "react";
import Image from "next/image";

interface QuizProgressProps {
  total: number;
  current: number; // 0-indexed
  checkedAnswers: Record<string, boolean>; // questionId → isCorrect
  questionIds: string[];
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  total,
  current,
  checkedAnswers,
  questionIds,
}) => {
  return (
    <div className="flex flex-col items-center gap-2" dir="ltr">
      {/* Question counter label */}
      <span className="text-sm font-bold text-[#7939E3] mb-1" dir="rtl">
        السؤال {current + 1} من {total}
      </span>

      {/* Step indicators */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Avatar at start */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#7939E3] shrink-0 shadow-xs">
          <Image
            src="/iamges/q-timeline-avatar.png"
            alt="المتعلم"
            width={32}
            height={32}
            style={{ width: "auto", height: "auto" }}
            className="object-cover"
          />
        </div>

        {/* Steps */}
        {questionIds.map((qId, idx) => {
          const isCompleted = idx < current;
          const isCurrent = idx === current;

          return (
            <React.Fragment key={qId}>
              {/* Connector line */}
              <div
                className={`h-0.5 w-4 sm:w-7 shrink-0 rounded-full transition-colors duration-300 ${
                  isCompleted || isCurrent ? "bg-[#7939E3]" : "bg-slate-200"
                }`}
              />

              {/* Step circle */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#7939E3] text-white shadow-xs"
                    : isCurrent
                    ? "bg-[#7939E3] text-white shadow-xs"
                    : "bg-[#F1F5F9] text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Connector to flag */}
        <div
          className={`h-0.5 w-4 sm:w-7 shrink-0 rounded-full ${
            current >= total - 1 ? "bg-[#7939E3]" : "bg-slate-200"
          }`}
        />

        {/* Finish flag */}
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <Image
            src="/iamges/q-flag-finish.svg"
            alt="النهاية"
            width={28}
            height={28}
            style={{ width: "auto", height: "auto" }}
            className={`transition-opacity duration-300 ${
              current >= total - 1 ? "opacity-100" : "opacity-40"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;
