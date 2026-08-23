"use client";

import React from "react";
import ChildCardSkeleton from "./ChildCardSkeleton";

export const ChildSliderSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="w-full py-4 relative select-none" dir="rtl">
      <div className="w-full pt-3 px-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className={`h-auto flex justify-center p-2 ${
              idx >= 1 ? "hidden sm:flex" : ""
            } ${idx >= 2 ? "sm:hidden md:flex" : ""} ${
              idx >= 3 ? "md:hidden xl:flex" : ""
            }`}
          >
            <ChildCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildSliderSkeleton;
