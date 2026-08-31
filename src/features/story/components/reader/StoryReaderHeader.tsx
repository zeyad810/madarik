"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { Story, getStoryQuizId } from "../../types";

interface StoryReaderHeaderProps {
  story: Story;
  isDownloadingPdf: boolean;
  onDownloadPdf: () => void;
  onNavigateToQuiz: () => void;
}

export const StoryReaderHeader: React.FC<StoryReaderHeaderProps> = ({
  story,
  isDownloadingPdf,
  onDownloadPdf,
  onNavigateToQuiz,
}) => {
  const hasQuiz = Boolean(getStoryQuizId(story));

  return (
    <div className="rounded-3xl p-4 sm:p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Story Metadata & Title */}
      <div className="text-right">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
          <span
            className={`text-xs font-bold px-3.5 py-0.5 rounded-full select-none ${
              story.availability === "paid"
                ? "bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]"
                : "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
            }`}
          >
            {story.availability === "paid" ? "مدفوعة" : "مجانية"}
          </span>
          {story.code && (
            <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-bold px-3.5 py-0.5 rounded-full select-none">
              {story.code}
            </span>
          )}
          {story.age_category && story.age_category !== "0-0" && (
            <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold px-3.5 py-0.5 rounded-full select-none">
              {story.age_category} سنوات
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-mad-text-primary">
          {story.title}
        </h1>
      </div>

      {/* Action Buttons: PDF & Quiz */}
      <div className="flex flex-wrap items-center gap-3">
        {Boolean(story.pdf_url) && (
          <button
            type="button"
            disabled={isDownloadingPdf}
            onClick={onDownloadPdf}
            className="py-2.5 px-5 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] disabled:opacity-75 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer select-none active:scale-95"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloadingPdf ? "جاري التحميل..." : "تحميل PDF"}</span>
          </button>
        )}

        {hasQuiz && (
          <Link
            href={`/stories/${story.id}/quiz`}
            onClick={onNavigateToQuiz}
            className="py-2.5 px-6 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer select-none hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>حل الاختبار</span>
          </Link>
        )}
      </div>
    </div>
  );
};
