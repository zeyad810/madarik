"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAgeCategoryFromBirthDate, calculateAgeInArabic } from "@/lib/utils";

interface StudentProfileCardProps {
  name: string;
  avatarUrl?: string | null;
  gender?: "male" | "female" | string;
  age?: number | null;
  birthDate?: string | null;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  name,
  avatarUrl,
  gender = "male",
  age,
  birthDate,
}) => {
  const isFemale = gender === "female";
  const defaultAvatar = isFemale
    ? "/assets/girl_avatar.png"
    : "/assets/boy_avatar.png";

  const [avatarSrc, setAvatarSrc] = useState<string>(avatarUrl || defaultAvatar);

  useEffect(() => {
    if (avatarUrl) {
      setAvatarSrc(avatarUrl);
    } else {
      setAvatarSrc(defaultAvatar);
    }
  }, [avatarUrl, defaultAvatar]);

  // Derive age category text
  const categoryText = React.useMemo(() => {
    if (age !== undefined && age !== null && age > 0) {
      return `الفئة العمرية: ${age} سنة`;
    }
    if (birthDate) {
      const cat = getAgeCategoryFromBirthDate(birthDate);
      const arabicAge = calculateAgeInArabic(birthDate);
      return `الفئة العمرية: ${cat}${arabicAge ? ` (${arabicAge})` : ""}`;
    }
    return "الفئة العمرية: -";
  }, [age, birthDate]);

  return (
    <div
      className="bg-white rounded-3xl sm:rounded-[32px] border border-purple-100 shadow-sm p-6 sm:p-10 select-none text-right"
      dir="rtl"
    >
      {/* Card Header Title */}
      <h2 className="text-[#7939E3] font-bold text-lg sm:text-xl">
        بيانات ملف الطالب
      </h2>
      <div className="border-b border-gray-100 mt-4 mb-8" />

      {/* Picture on the side, name under it, and category only */}
      <div className="flex flex-col items-start gap-3 w-fit">
        {/* Student Avatar */}
        <div className="size-24 sm:size-28 rounded-full ring-4 ring-[#7939E3]/30 p-1 bg-purple-50 overflow-hidden shadow-sm">
          <Image
            src={avatarSrc}
            alt={name || "صورة الطالب"}
            width={112}
            height={112}
            className="size-full object-cover rounded-full"
            onError={() => {
              if (avatarSrc !== defaultAvatar) {
                setAvatarSrc(defaultAvatar);
              }
            }}
          />
        </div>

        {/* Name directly under picture */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
          {name || "الطالب"}
        </h3>

        {/* Category directly under name */}
        <span className="text-sm sm:text-base font-semibold text-[#7939E3] bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100/60">
          {categoryText}
        </span>
      </div>
    </div>
  );
};

export default StudentProfileCard;
