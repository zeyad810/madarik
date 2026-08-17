"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface StoryEmptyStateProps {
  title?: string;
  buttonText?: string;
  buttonHref?: string;
  onResetFilters?: () => void;
  className?: string;
}

export const StoryEmptyState: React.FC<StoryEmptyStateProps> = ({
  title = "لا توجد قصص متاحة",
  buttonText = "العودة للرئيسية",
  buttonHref = "/",
  onResetFilters,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
      className={`w-full py-16 px-4 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mb-6">
        <Image
          src="/iamges/Story-Page-Empty.png"
          alt={title}
          fill
          sizes="(max-width: 768px) 256px, 384px"
          className="object-contain"
          priority
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-mad-text-primary mb-6">
        {title}
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={buttonHref}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-[#7939E3] text-[#7939E3] font-bold text-sm hover:bg-[#7939E3] hover:text-white transition-all duration-200 shadow-xs cursor-pointer"
        >
          <span>{buttonText}</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all duration-200 cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>
    </motion.div>
  );
};
