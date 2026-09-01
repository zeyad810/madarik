"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { QuizTimer } from "./QuizTimer";

interface QuizMetricsCardsProps {
  storyId: string;
  currentPoints: number;
  startTime?: number | null;
  /** Kept for backwards compatibility */
  questionId?: string;
  durationSeconds?: number;
  onTimerExpire?: () => void;
}

export const QuizMetricsCards: React.FC<QuizMetricsCardsProps> = ({
  storyId,
  currentPoints,
  startTime,
}) => {
  return (
    <div className="w-full flex flex-col lg:hidden">
      {/* Top Exit Button Row (Right aligned in RTL) */}
      <div className="w-full flex justify-start mb-4">
        <Link
          href={`/stories/${storyId}`}
          className="p-2.5 rounded-2xl border border-red-100 bg-red-50/50 text-red-500 hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center shadow-xs rotate-180"
          title="خروج من الاختبار"
          aria-label="خروج من الاختبار"
        >
          <LogOut className="w-5 h-5 rotate-180" />
        </Link>
      </div>

      {/* 2 Metric Cards: Time & Points (Side by Side) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
        {/* Card 1: Elapsed Time */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center min-h-36.25">
          <QuizTimer startTime={startTime} />
        </div>

        {/* Card 2: Points */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-between gap-1.5 min-h-36.25">
          <Image
            src="/iamges/q-trophy-circle.png"
            alt="النقاط"
            width={46}
            height={46}
            style={{ width: "auto", height: "auto" }}
            className="drop-shadow-xs"
          />
          <span className="text-xs font-bold text-slate-400">نقاطك</span>
          <span className="text-2xl sm:text-3xl font-black text-[#7939E3] leading-none">
            {currentPoints}
          </span>
          <span className="text-[11px] font-bold text-[#10B981] mt-0.5">
            +20 نقطة للإجابة الصحيحة
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizMetricsCards;
