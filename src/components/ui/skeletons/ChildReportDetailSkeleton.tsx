"use client";

import React from "react";

export const ChildReportDetailSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-20!" dir="rtl">
      <div className="container mx-auto space-y-6 animate-pulse select-none">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-mad-white-200/80 rounded-md" />

        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-44 bg-mad-white-200/80 rounded-md" />
          <div className="h-4 w-80 bg-mad-white-100 rounded-md" />
        </div>

        {/* Child Profile Card Skeleton */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border-2 border-mad-white-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="size-14 sm:size-16 rounded-full bg-mad-white-200/80 ring-2 ring-mad-purple-50" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-mad-white-200/80 rounded-md" />
              <div className="h-4 w-48 bg-mad-white-100 rounded-md" />
            </div>
          </div>
          <div className="h-5 w-24 bg-mad-white-100 rounded-full" />
        </div>

        {/* 3 Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[28px] p-6 sm:p-7 border border-gray-100 border-t-2 border-t-mad-purple-200 flex flex-col justify-between min-h-[165px]"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-8 bg-mad-purple-50 rounded-lg" />
                <div className="h-5 w-32 bg-mad-white-200/70 rounded" />
              </div>
              <div className="flex items-end justify-between mt-4">
                <div className="h-10 w-20 bg-mad-white-200/80 rounded-md" />
                <div className="h-5 w-16 bg-mad-white-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="w-full bg-white rounded-3xl p-6 border-2 border-mad-white-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-mad-white-200/80 rounded-md" />
            <div className="h-9 w-28 bg-mad-white-200 rounded-full" />
          </div>
          <div className="h-12 w-full bg-[#F8FAFC] rounded-2xl" />
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-12 w-full bg-mad-white-100/60 rounded-xl" />
          ))}
        </div>

        {/* Reading History Skeleton */}
        <div className="w-full bg-white rounded-3xl p-6 border-2 border-mad-white-200 space-y-4">
          <div className="h-6 w-44 bg-mad-white-200/80 rounded-md mb-2" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 w-full bg-mad-white-100/70 border border-mad-white-200/70 rounded-2xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildReportDetailSkeleton;
