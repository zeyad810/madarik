"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, TrendingUp } from "lucide-react";
import type { ChildReportItem } from "../types";
import {
  getChildGradeAndAge,
  calculateChildAverageScore,
  getChildStoriesCount,
  getChildBadgesCount,
} from "../utils";
import Link from "next/link";

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

  const isActive = child.status === "active";
  const storiesCount = getChildStoriesCount(child);
  const averageScore = calculateChildAverageScore(child);
  const badgesCount = getChildBadgesCount(child);
  const gradeAndAge = getChildGradeAndAge(child.birth_date);

  return (
    <div
      dir="rtl"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 border-2 border-mad-white-200 hover:border-mad-purple-300 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between select-none"
    >
      {/* 1. Header Row: Avatar + Name + Subtitle (Right) & Active Status (Left) */}
      <div className="flex items-start justify-between gap-2">
        {/* Right side in RTL: Avatar + Name + Grade/Age */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-13 rounded-full overflow-hidden p-0.5 ring-2 ring-mad-purple-100 bg-mad-purple-50 shrink-0 shadow-inner flex items-center justify-center">
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
            <h3 className="font-bold text-mad-text-primary text-base sm:text-lg truncate">
              {child.name}
            </h3>
            {gradeAndAge ? (
              <span className="text-xs text-mad-text-secondary font-medium truncate mt-0.5">
                {gradeAndAge}
              </span>
            ) : null}
          </div>
        </div>

        {/* Left side in RTL: Status indicator dot + text */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium shrink-0 pt-1 ${
            isActive ? "text-mad-text-secondary" : "text-mad-white-400"
          }`}
        >
          <span
            className={`size-2 rounded-full shrink-0 ${
              isActive ? "bg-[#22C55E]" : "bg-mad-white-300"
            }`}
          />
          <span>{isActive ? "نشط" : "غير نشط"}</span>
        </div>
      </div>

      {/* 2. Middle Row: Stories Read Count & Average Score */}
      <div className="flex items-center justify-between my-5 px-1 text-xs sm:text-sm font-semibold">
        {/* Right Metric: Stories Read */}
        <div className="flex items-center gap-1.5 text-mad-text-secondary">
          <div className="size-6 rounded-lg bg-mad-purple-50 text-mad-main flex items-center justify-center shrink-0">
            <BookOpen className="size-3.5 stroke-[2.2]" />
          </div>
          <span>عدد القصص المقروءة : </span>
          <span className="font-bold text-mad-text-primary">{storiesCount}</span>
        </div>

        {/* Left Metric: Average Score */}
        <div className="flex items-center gap-1.5 text-mad-text-secondary">
          <div className="size-6 rounded-lg bg-mad-purple-50 text-mad-main flex items-center justify-center shrink-0">
            <TrendingUp className="size-3.5 stroke-[2.2]" />
          </div>
          <span>متوسط النتائج : </span>
          <span className="font-bold text-mad-text-primary">%{averageScore}</span>
        </div>
      </div>

      {/* 3. Bottom Row: Badges Count Pill + View Details Button */}
      <div className="flex items-center gap-3 w-full">
        {/* Badges Count Pill */}
        <div className="flex-1 bg-mad-purple-50 text-mad-main rounded-full py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm shadow-2xs">
          <span className="text-base leading-none">🏆</span>
          <span>عدد الأوسمة : </span>
          <span className="font-extrabold text-mad-purple-800">{badgesCount}</span>
        </div>

        {/* Action Button: View Details */}
        <Link 
          href={`/parents/childReports/${child.id}`}
          className="flex-1 py-2.5 px-3 rounded-full border-2 border-mad-secondary text-mad-secondary hover:bg-mad-secondary hover:text-white font-bold text-xs sm:text-sm text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow active:scale-[0.99] flex items-center justify-center whitespace-nowrap"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export { ChildReportCardSkeleton } from "@/components/ui";
export default ChildReportCard;
