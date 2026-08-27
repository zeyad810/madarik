"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const StoriesPagination: React.FC<StoriesPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      dir="rtl"
      className="flex items-center justify-center gap-2 mt-8 mb-6 select-none"
    >
      {/* Previous Page Button (Right in RTL) */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="الصفحة السابقة"
        className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-purple-50 hover:border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-9 h-9 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentPage === page
                ? "bg-[#7939E3] text-white shadow-md shadow-purple-500/25 scale-105"
                : "text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-purple-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Page Button (Left in RTL) */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="الصفحة التالية"
        className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-purple-50 hover:border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

export default StoriesPagination;
