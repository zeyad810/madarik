"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ChildReportSummaryCardProps {
  name: string;
  avatarUrl?: string | null;
  gender?: "male" | "female" | string;
  gradeAndAge?: string;
  levelText?: string;
  activityTime?: string;
  status?: "active" | "inactive" | string;
  isActive?: boolean;
}

export const ChildReportSummaryCard: React.FC<ChildReportSummaryCardProps> = ({
  name,
  avatarUrl,
  gender = "male",
  gradeAndAge,
  levelText,
  status,
  isActive,
}) => {
  const defaultAvatar =
    gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png";
  const [avatarSrc, setAvatarSrc] = useState<string>(avatarUrl || defaultAvatar);

  useEffect(() => {
    if (avatarUrl) {
      setAvatarSrc(avatarUrl);
    } else {
      setAvatarSrc(defaultAvatar);
    }
  }, [avatarUrl, defaultAvatar]);

  const isAccountActive =
    isActive !== undefined
      ? isActive
      : status !== undefined
      ? status === "active"
      : true;

  const subtitle = [gradeAndAge, levelText].filter(Boolean).join(" • ");

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border-2 border-mad-white-200 shadow-xs flex items-center justify-between gap-3 select-none" dir="rtl">
      {/* Right side in RTL: Avatar + Name + Subtitle */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-14 sm:size-16 rounded-full overflow-hidden p-0.5 ring-2 ring-mad-purple-100 bg-mad-purple-50 shrink-0 shadow-inner flex items-center justify-center">
          <Image
            src={avatarSrc}
            alt={name || "صورة الطفل"}
            width={64}
            height={64}
            className="size-full object-cover rounded-full"
            onError={() => {
              if (avatarSrc !== defaultAvatar) {
                setAvatarSrc(defaultAvatar);
              }
            }}
          />
        </div>
        <div className="min-w-0 flex flex-col text-right">
          <h2 className="font-extrabold text-mad-text-primary text-lg sm:text-2xl truncate">
            {name || "اسم الطفل"}
          </h2>
          {subtitle && (
            <span className="text-xs sm:text-sm text-mad-text-secondary font-medium truncate mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Left side in RTL: Status indicator dot + text (نشط / غير نشط) */}
      <div
        className={`flex items-center gap-2 text-xs sm:text-sm font-medium shrink-0 ${
          isAccountActive ? "text-mad-text-secondary" : "text-gray-400"
        }`}
      >
        <span
          className={`size-2.5 rounded-full shrink-0 ${
            isAccountActive ? "bg-[#22C55E]" : "bg-gray-300"
          }`}
        />
        <span>{isAccountActive ? "نشط" : "غير نشط"}</span>
      </div>
    </div>
  );
};

export default ChildReportSummaryCard;
