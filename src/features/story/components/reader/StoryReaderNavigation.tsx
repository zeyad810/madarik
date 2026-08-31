"use client";

import React from "react";
import Image from "next/image";

interface StoryReaderNavigationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const StoryReaderNavigation: React.FC<StoryReaderNavigationProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-10 pt-4">
      {/* Previous Page Button (Right in RTL) */}
      <button
        type="button"
        onClick={onPrevPage}
        disabled={currentPage === 1}
        aria-label="الصفحة السابقة"
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
          currentPage === 1
            ? "bg-purple-200/50 cursor-not-allowed opacity-40"
            : "bg-[#7939E3] hover:bg-[#6824D6] hover:scale-105 active:scale-95 cursor-pointer"
        }`}
      >
        <Image
          src="/iamges/redo.svg"
          alt="السابق"
          width={22}
          height={22}
          className="w-5 h-5"
        />
      </button>

      {/* Next Page Button (Left in RTL) */}
      <button
        type="button"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        aria-label="الصفحة التالية"
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
          currentPage === totalPages
            ? "bg-purple-200/50 cursor-not-allowed opacity-40"
            : "bg-[#7939E3] hover:bg-[#6824D6] hover:scale-105 active:scale-95 cursor-pointer"
        }`}
      >
        <Image
          src="/iamges/undo.svg"
          alt="التالي"
          width={22}
          height={22}
          className="w-5 h-5"
        />
      </button>
    </div>
  );
};
