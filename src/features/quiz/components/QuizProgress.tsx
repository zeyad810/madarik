"use client";

import React from "react";
import Image from "next/image";

interface QuizProgressProps {
  total: number;
  current: number; // 0-indexed
  checkedAnswers: Record<string, boolean>; // questionId → isCorrect
  questionIds: string[];
}

type ProgressItem =
  | { type: "question"; index: number; id: string }
  | { type: "ellipsis"; key: string; isPast: boolean };

function getProgressItems(
  total: number,
  current: number,
  questionIds: string[]
): ProgressItem[] {
  if (total <= 5) {
    return questionIds.map((id, index) => ({
      type: "question",
      index,
      id,
    }));
  }

  // If current question is near start (0 or 1)
  if (current <= 1) {
    return [
      { type: "question", index: 0, id: questionIds[0] || "q-0" },
      { type: "question", index: 1, id: questionIds[1] || "q-1" },
      { type: "question", index: 2, id: questionIds[2] || "q-2" },
      { type: "ellipsis", key: "ellipsis-end", isPast: false },
      { type: "question", index: total - 1, id: questionIds[total - 1] || `q-${total - 1}` },
    ];
  }

  // If current question is near end (total - 1 or total - 2)
  if (current >= total - 2) {
    return [
      { type: "question", index: 0, id: questionIds[0] || "q-0" },
      { type: "ellipsis", key: "ellipsis-start", isPast: true },
      { type: "question", index: total - 3, id: questionIds[total - 3] || `q-${total - 3}` },
      { type: "question", index: total - 2, id: questionIds[total - 2] || `q-${total - 2}` },
      { type: "question", index: total - 1, id: questionIds[total - 1] || `q-${total - 1}` },
    ];
  }

  // Current question is in middle
  return [
    { type: "question", index: 0, id: questionIds[0] || "q-0" },
    { type: "ellipsis", key: "ellipsis-left", isPast: true },
    { type: "question", index: current, id: questionIds[current] || `q-${current}` },
    { type: "ellipsis", key: "ellipsis-right", isPast: false },
    { type: "question", index: total - 1, id: questionIds[total - 1] || `q-${total - 1}` },
  ];
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  total,
  current,
  checkedAnswers,
  questionIds,
}) => {
  const items = getProgressItems(total, current, questionIds);

  return (
    <div className="flex flex-col items-center gap-3 w-full" dir="rtl">
      {/* Question counter label */}
      <h3 className="text-base sm:text-lg font-black text-[#7939E3] text-center">
        السؤال {current + 1} من {total}
      </h3>

      {/* Step indicators (Left to Right) */}
      <div className="flex items-center gap-1.5 sm:gap-2" dir="ltr">
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
        {items.map((item, idx) => {
          if (item.type === "ellipsis") {
            return (
              <React.Fragment key={item.key}>
                {/* Connector line */}
                <div
                  className={`h-0.5 w-3 sm:w-5 shrink-0 rounded-full transition-colors duration-300 ${
                    item.isPast ? "bg-[#7939E3]" : "bg-slate-200"
                  }`}
                />

                {/* Ellipsis indicator */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs tracking-widest shrink-0 select-none">
                  •••
                </div>
              </React.Fragment>
            );
          }

          const isCompleted = item.index < current;
          const isCurrent = item.index === current;

          return (
            <React.Fragment key={item.id}>
              {/* Connector line */}
              <div
                className={`h-0.5 w-3.5 sm:w-6 shrink-0 rounded-full transition-colors duration-300 ${
                  isCompleted || isCurrent ? "bg-[#7939E3]" : "bg-slate-200"
                }`}
              />

              {/* Step circle */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#7939E3] text-white shadow-xs"
                    : isCurrent
                    ? "bg-[#7939E3] text-white shadow-sm ring-2 sm:ring-4 ring-purple-100 scale-105"
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
                  item.index + 1
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Connector to flag */}
        <div
          className={`h-0.5 w-3.5 sm:w-6 shrink-0 rounded-full ${
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
            className={`transition-opacity duration-300`}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;
