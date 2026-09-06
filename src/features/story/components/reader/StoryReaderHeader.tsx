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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
      {/* Story Metadata & Title */}
      <div className="text-right flex flex-col gap-2">
        {/* Title + Availability Badge (مجانية / مدفوعة) on the same line */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-mad-text-primary">
            {story.title}
          </h1>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full select-none ${
              story.availability === "paid"
                ? "bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]"
                : "bg-[#E6F7F5] text-[#0D9488] border border-[#99F6E4]/50"
            }`}
          >
            {story.availability === "paid" ? "مدفوعة" : "مجانية"}
          </span>
        </div>

        {/* Badges Under Title: Code & Age Category */}
        <div className="flex flex-wrap items-center gap-2">
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
      </div>

      {/* Action Buttons: Quiz & PDF */}
      <div className="flex flex-wrap items-center gap-3">
        {hasQuiz && (
          <Link
            href={`/stories/${story.id}/quiz`}
            onClick={onNavigateToQuiz}
            className="py-2.5 px-6 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer select-none active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>حل الاختبار</span>
          </Link>
        )}

        {Boolean(story.pdf_url) && (
          <button
            type="button"
            disabled={isDownloadingPdf}
            onClick={onDownloadPdf}
            className="py-2.5 px-5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] disabled:opacity-75 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer select-none active:scale-95"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloadingPdf ? "جاري التحميل..." : "تحميل PDF"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
