"use client";

import React from "react";
import Image from "next/image";
import { SquarePen } from "lucide-react";
import { ManagedChild } from "../types";
import { Toggle } from "@/components/ui";


interface ChildCardProps {
  child: ManagedChild;
  onEdit?: (child: ManagedChild) => void;
  onToggleStatus?: (child: ManagedChild) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  onEdit,
  onToggleStatus,
}) => {
  const isActive = child.status === "active";

  return (
    <div
      dir="rtl"
      className={`w-full mx-auto rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-between transition-all duration-200 select-none border-2 box-border ${
        !isActive
          ? "border-gray-200/90 bg-[#F9FAFB]/90 opacity-80 hover:opacity-95 shadow-xs"
          : "border-gray-200 bg-white hover:border-purple-200 shadow-xs hover:shadow-md hover:scale-[1.01]"
      }`}
    >
      {/* 1. Avatar */}
      <div className="size-24 rounded-full overflow-hidden p-1 ring-2 ring-purple-100/80 bg-purple-50 flex items-center justify-center mb-3 shrink-0 shadow-inner">
        <Image
          src={child.avatar}
          alt={child.name}
          width={96}
          height={96}
          className="size-full object-cover rounded-full"
        />
      </div>

      {/* 2. Name */}
      <h3 className="text-xl font-bold text-gray-900 text-center my-4 truncate max-w-full">
        {child.name}
      </h3>

      {/* 3. Age Category Badge */}
      <div
        className={`px-3.5 py-1 rounded-full text-xs font-bold mb-2 ${
          isActive
            ? "bg-[#EDE9FE] text-mad-main"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        الفئة: {child.ageCategory}
      </div>

      {/* 4. Divider */}
      <div className="w-full border-t border-gray-100 my-6" />

      {/* 5. Account Status Row */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold mb-4 px-1">
        {/* Status Label */}
        <span className="text-gray-500 font-medium text-xs sm:text-sm">
          حالة الحساب
        </span>

        {/* Toggle Switch + Status Text */}
        <div className="flex items-center gap-2">
          <span
            className={`font-bold text-xs ${
              isActive ? "text-[#22C55E]" : "text-gray-400"
            }`}
          >
            {isActive ? "مفعل" : "معطل"}
          </span>

          <Toggle
            checked={isActive}
            onChange={() => onToggleStatus?.(child)}
            ariaLabel="حالة الحساب"
          />
        </div>
      </div>

      {/* 6. Edit Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(child);
        }}
        className="w-full py-2.5 px-4 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
      >
        <SquarePen className="size-4 stroke-[2.2]" />
        <span>تعديل</span>
      </button>
    </div>
  );
};

export default ChildCard;
