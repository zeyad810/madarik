"use client";

import React from "react";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import { getQuestionTypeLabel } from "../utils";

interface QuizHeaderProps {
  storyId: string;
  storyTitle?: string;
  quizStoryTitle?: string;
  storyLevel?: any;
  quizLevel?: any;
  currentQuestionType?: string;
  currentQuestionOptions?: string[];
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  storyId,
  storyTitle,
  quizStoryTitle,
  storyLevel,
  quizLevel,
  currentQuestionType,
  currentQuestionOptions,
}) => {
  const displayTitle = storyTitle || quizStoryTitle || "القصة";

  const resolvedLevel = (() => {
    const lvl =
      typeof storyLevel === "string"
        ? storyLevel
        : storyLevel?.name || quizLevel || "مستوى 1";
    return String(lvl).startsWith("مستوى") ? lvl : `مستوى ${lvl}`;
  })();

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Breadcrumb Navigation */}
      <div className="mb-3 select-none">
        <AutoBreadcrumbs
          rootIcon={null}
          dynamicLabels={{
            [storyId]: displayTitle,
            quiz: "اختبار القصة",
          }}
        />
      </div>

      {/* Header Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E1B4B]">
          اختبار: {displayTitle}
        </h1>

        <div className="flex items-center gap-2">
          <span className="bg-[#F1FAF0] text-[#008421] text-sm px-4 py-1 rounded-full">
            {resolvedLevel}
          </span>
          <span className="bg-mad-purple-50 text-[#6D28D9] text-sm px-4 py-1 rounded-full transition-all">
            {getQuestionTypeLabel(currentQuestionType, currentQuestionOptions)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
