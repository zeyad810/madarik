"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface StorySearchBannerProps {
  searchQuery: string;
  totalResults: number;
  isLoading: boolean;
  onClearSearch: () => void;
}

export const StorySearchBanner: React.FC<StorySearchBannerProps> = ({
  searchQuery,
  totalResults,
  isLoading,
  onClearSearch,
}) => {
  if (!searchQuery) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mb-6 flex items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl bg-purple-50 border border-purple-200 text-mad-main"
      dir="rtl"
    >
      <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
        <Search className="size-5 shrink-0" />
        <span>
          نتائج البحث عن: &quot;{searchQuery}&quot;
          {!isLoading && (
            <span className="text-xs font-normal text-purple-700 mr-2">
              ({totalResults} قصة)
            </span>
          )}
        </span>
      </div>
      <button
        type="button"
        onClick={onClearSearch}
        aria-label="مسح البحث"
        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 transition-all cursor-pointer shadow-xs active:scale-95"
      >
        <span>مسح البحث</span>
        <X className="size-3.5" />
      </button>
    </motion.div>
  );
};

export default StorySearchBanner;
