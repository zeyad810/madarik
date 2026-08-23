"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, TrendingUp } from "lucide-react";
import type { ChildReportItem } from "../types";
import {
  getChildGradeAndAge,
  formatArabicActivityTime,
  calculateChildDurationMinutes,
  getChildLevel,
  calculateChildAverageScore,
  getChildStoriesCount,
} from "../utils";

interface ChildReportCardProps {
  child: ChildReportItem;
  onViewDetails?: (child: ChildReportItem) => void;
}

export const ChildReportCard: React.FC<ChildReportCardProps> = ({
  child,
  onViewDetails,
}) => {
  const defaultAvatar =
    child.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png";
  const [avatarSrc, setAvatarSrc] = useState<string>(
    child.avatar_img || child.avatar || defaultAvatar
  );

  const storiesCount = getChildStoriesCount(child);
  const averageScore = calculateChildAverageScore(child);
  const durationMinutes = calculateChildDurationMinutes(child);
  const levelText = getChildLevel(child);
  const gradeAndAge = getChildGradeAndAge(child.birth_date);
  const activityTime = formatArabicActivityTime(child.updated_at);

  return (
    <div
      dir="rtl"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 border-2 border-gray-200/90 hover:border-purple-300 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between select-none"
    >
      {/* 1. Header Row: Avatar + Name + Subtitle (Right) & Online Activity (Left) */}
      <div className="flex items-start justify-between gap-2">
        {/* Right side in RTL: Avatar + Name + Grade/Age */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-13 rounded-full overflow-hidden p-0.5 ring-2 ring-purple-100 bg-purple-50 shrink-0 shadow-inner flex items-center justify-center">
            <Image
              src={avatarSrc}
              alt={child.name}
              width={52}
              height={52}
              className="size-full object-cover rounded-full"
              onError={() => {
                if (avatarSrc !== defaultAvatar) {
                  setAvatarSrc(defaultAvatar);
                }
              }}
            />
          </div>
          <div className="min-w-0 flex flex-col text-right">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
              {child.name}
            </h3>
            {gradeAndAge ? (
              <span className="text-xs text-gray-400 font-medium truncate mt-0.5">
                {gradeAndAge}
              </span>
            ) : null}
          </div>
        </div>

        {/* Left side in RTL: Green indicator dot + activity text */}
        {activityTime ? (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium shrink-0 pt-1">
            <span className="size-2 rounded-full bg-[#22C55E] shrink-0" />
            <span>{activityTime}</span>
          </div>
        ) : null}
      </div>

      {/* 2. Middle Row: Stories Read Count & Average Score */}
      <div className="flex items-center justify-between my-5 px-1 text-xs sm:text-sm font-semibold">
        {/* Right Metric: Stories Read */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <div className="size-6 rounded-lg bg-purple-50 text-mad-main flex items-center justify-center shrink-0">
            <BookOpen className="size-3.5 stroke-[2.2]" />
          </div>
          <span>عدد القصص المقروءة : </span>
          <span className="font-bold text-gray-900">{storiesCount}</span>
        </div>

        {/* Left Metric: Average Score */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <div className="size-6 rounded-lg bg-purple-50 text-mad-main flex items-center justify-center shrink-0">
            <TrendingUp className="size-3.5 stroke-[2.2]" />
          </div>
          <span>متوسط النتائج : </span>
          <span className="font-bold text-gray-900">%{averageScore}</span>
        </div>
      </div>

      {/* 3. Highlight Pill Bar: Level (Right) & Total Minutes (Left) */}
      <div className="w-full bg-[#F4EFFE] text-[#6D28D9] rounded-2xl py-2.5 px-4 flex items-center justify-between mb-5 font-bold text-xs sm:text-sm">
        {/* Right side in RTL: Trophy icon + Level */}
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">🏆</span>
          <span>{levelText}</span>
        </div>

        {/* Left side in RTL: Duration */}
        <div className="text-xs sm:text-sm text-[#7C3AED] font-semibold">
          <span>{durationMinutes} دقيقة</span>
        </div>
      </div>

      {/* 4. Action Button: View Details */}
      <button
        type="button"
        onClick={() => onViewDetails?.(child)}
        className="w-full py-2.5 px-6 rounded-full border-2 border-[#14B8A6] text-[#0D9488] hover:bg-[#14B8A6] hover:text-white font-bold text-sm sm:text-base text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow active:scale-[0.99] flex items-center justify-center"
      >
        عرض التفاصيل
      </button>
    </div>
  );
};

export { ChildReportCardSkeleton } from "@/components/ui";
export default ChildReportCard;
