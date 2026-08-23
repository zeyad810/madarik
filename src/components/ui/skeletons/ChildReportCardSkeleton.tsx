"use client";

import React from "react";

export const ChildReportCardSkeleton: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 border-2 border-mad-white-200 shadow-xs animate-pulse flex flex-col justify-between select-none min-h-[260px]"
    >
      {/* 1. Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="size-13 rounded-full bg-mad-white-200/80 ring-2 ring-mad-purple-50 shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-24 bg-mad-white-200/80 rounded-md" />
            <div className="h-3.5 w-32 bg-mad-white-100 rounded-md" />
          </div>
        </div>
        <div className="h-4 w-16 bg-mad-white-100 rounded-full" />
      </div>

      {/* 2. Metrics Skeleton */}
      <div className="flex items-center justify-between my-5 px-1">
        <div className="h-4 w-28 bg-mad-white-200/70 rounded" />
        <div className="h-4 w-24 bg-mad-white-200/70 rounded" />
      </div>

      {/* 3. Bottom Row Skeleton (Badges Pill + Button) */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-10 bg-mad-purple-50/70 rounded-full" />
        <div className="flex-1 h-10 bg-mad-white-200/80 rounded-full" />
      </div>
    </div>
  );
};

export default ChildReportCardSkeleton;
