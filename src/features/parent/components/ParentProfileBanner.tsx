"use client";

import React from "react";
import Image from "next/image";
import { Pencil, X } from "lucide-react";

export interface ParentProfileBannerProps {
  name: string;
  avatar?: string;
  roleText: string;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const ParentProfileBanner: React.FC<ParentProfileBannerProps> = ({
  name,
  avatar,
  roleText,
  isEditing,
  onToggleEdit,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* User Avatar + Name & Role (RTL Right side) */}
      <div className="flex items-center gap-4 sm:gap-5 order-1">
        <div className="relative size-16 sm:size-20 rounded-full ring-2 ring-purple-600 p-0.5 overflow-hidden shrink-0 bg-purple-50">
          <Image
            src={avatar || "/assets/user_avatar.png"}
            alt={name}
            width={80}
            height={80}
            className="size-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col text-right space-y-1">
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900">
            {name}
          </h2>
          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            {roleText}
          </span>
        </div>
      </div>

      {/* Edit Profile Action Button (RTL Left side) */}
      <button
        type="button"
        onClick={onToggleEdit}
        className={`order-2 w-full sm:w-auto px-6 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 ${
          isEditing
            ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            : "bg-[#7F48EF] hover:bg-[#6D28D9] text-white"
        }`}
      >
        <span>{isEditing ? "إلغاء التعديل" : "تعديل الملف الشخصي"}</span>
        {isEditing ? (
          <X className="size-4 stroke-[2.2]" />
        ) : (
          <Pencil className="size-4 stroke-[2.2]" />
        )}
      </button>
    </div>
  );
};

export default ParentProfileBanner;
