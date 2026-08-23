"use client";

import React from "react";

export const ChildCardSkeleton: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="w-full mx-auto rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-between border-2 border-gray-200/70 bg-white shadow-xs animate-pulse box-border select-none min-h-[380px]"
    >
      {/* 1. Avatar Skeleton */}
      <div className="size-24 rounded-full bg-gray-200/80 ring-2 ring-purple-50 mb-3 shrink-0" />

      {/* 2. Name Skeleton */}
      <div className="h-7 w-32 bg-gray-200/80 rounded-lg my-4" />

      {/* 3. Age Category Badge Skeleton */}
      <div className="h-6 w-28 bg-purple-50 rounded-full mb-2" />

      {/* 4. Divider */}
      <div className="w-full border-t border-gray-100 my-6" />

      {/* 5. Account Status Row Skeleton */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <div className="h-4 w-16 bg-gray-200/70 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 bg-gray-200/70 rounded" />
          <div className="w-11 h-6 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* 6. Edit Action Button Skeleton */}
      <div className="w-full h-[42px] rounded-full bg-gray-200/80" />
    </div>
  );
};

export default ChildCardSkeleton;
