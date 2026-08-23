"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ChildReportStatsProps {
  storiesCount: number;
  quizzesCount: number;
  averageScore: number;
  storiesGrowth?: string;
  quizzesGrowth?: string;
  scoreGrowth?: string;
}

export const ChildReportStats: React.FC<ChildReportStatsProps> = ({
  storiesCount,
  quizzesCount,
  averageScore,
  storiesGrowth = "3.2%",
  quizzesGrowth = "3.2%",
  scoreGrowth = "3.2%",
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" dir="rtl">
      {/* =========================================================================
          Card 1 (Right in RTL): Stories Read
         ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-gray-100 border-t-2 border-t-[#6D28D9] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[165px] select-none">
        {/* Top: 3D Book Icon + Title */}
        <div className="flex items-center gap-2.5 text-[#475569]">
          <div className="size-8 shrink-0 flex items-center justify-center">
            <Image
              src="/assets/book.svg"
              alt="عدد القصص المقروءة"
              width={32}
              height={32}
              className="size-full object-contain"
            />
          </div>
          <span className="text-base sm:text-lg font-bold">
            عدد القصص المقروءة
          </span>
        </div>

        {/* Bottom Row: Big Number (Right) & Growth Badge (Left) */}
        <div className="flex items-end justify-between mt-4">
          {/* Right in RTL: Big Number */}
          <div className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-none">
            {storiesCount}
          </div>

          {/* Left in RTL: Growth Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#16A34A] text-xs font-extrabold">
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
            <span>{storiesGrowth}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Card 2 (Middle in RTL): Quizzes Count
         ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-gray-100 border-t-2 border-t-[#14B8A6] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[165px] select-none">
        {/* Top: Quiz Icon + Title */}
        <div className="flex items-center gap-2.5 text-[#475569]">
          <div className="size-8 shrink-0 flex items-center justify-center">
            <Image
              src="/assets/rewardd.svg"
              alt="عدد الاختبارات"
              width={32}
              height={32}
              className="size-full object-contain"
            />
          </div>
          <span className="text-base sm:text-lg font-bold">
            عدد الاختبارات
          </span>
        </div>

        {/* Bottom Row: Big Number (Right) & Growth Badge (Left) */}
        <div className="flex items-end justify-between mt-4">
          {/* Right in RTL: Big Number */}
          <div className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-none">
            {quizzesCount}
          </div>

          {/* Left in RTL: Growth Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#16A34A] text-xs font-extrabold">
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
            <span>{quizzesGrowth}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Card 3 (Left in RTL): Average Score
         ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-gray-100 border-t-2 border-t-[#F59E0B] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[165px] select-none">
        {/* Top: Analytics Icon + Title */}
        <div className="flex items-center gap-2.5 text-[#475569]">
          <div className="size-8 shrink-0 flex items-center justify-center">
            <Image
              src="/assets/user-performance-analytics.svg"
              alt="متوسط النتائج"
              width={32}
              height={32}
              className="size-full object-contain"
            />
          </div>
          <span className="text-base sm:text-lg font-bold">
            متوسط النتائج
          </span>
        </div>

        {/* Bottom Row: Big Number (Right) & Growth Badge (Left) */}
        <div className="flex items-end justify-between mt-4">
          {/* Right in RTL: Big Number */}
          <div className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-none">
            %{averageScore}
          </div>

          {/* Left in RTL: Growth Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#16A34A] text-xs font-extrabold">
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
            <span>{scoreGrowth}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildReportStats;
