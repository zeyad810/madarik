"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { QuizTimer } from "./QuizTimer";

interface QuizSidebarProps {
  storyId: string;
  currentPoints: number;
  startTime?: number | null;
  /** Kept for backwards compatibility */
  questionId?: string;
  durationSeconds?: number;
  onTimerExpire?: () => void;
}

export const QuizSidebar: React.FC<QuizSidebarProps> = ({
  storyId,
  currentPoints,
  startTime,
}) => {
  return (
    <aside className="lg:col-span-3 hidden lg:flex flex-col gap-4">
      {/* 1. Score Card */}
      <div className="bg-white rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center gap-2">
        <Image
          src="/iamges/q-trophy-circle.png"
          alt="النقاط"
          width={56}
          height={56}
          style={{ width: "auto", height: "auto" }}
          className="drop-shadow-xs"
        />
        <span className="text-xs font-bold text-slate-500">نقاطك</span>
        <span className="text-4xl font-black text-[#7939E3]">
          {currentPoints}
        </span>
        <span className="text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-full border border-emerald-100">
          +20 نقطة للإجابة الصحيحة
        </span>
      </div>

      {/* 2. Timer Card */}
      <div className="bg-white rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center">
        <QuizTimer startTime={startTime} />
      </div>

      {/* 3. Exit Quiz Button */}
      <Link
        href={`/stories/${storyId}`}
        className="w-full py-3 px-4 rounded-full border border-red-200 bg-white text-red-500 hover:bg-red-50 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>خروج من الاختبار</span>
      </Link>
    </aside>
  );
};

export default QuizSidebar;
