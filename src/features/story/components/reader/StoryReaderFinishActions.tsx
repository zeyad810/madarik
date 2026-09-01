"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useActiveAccount } from "@/hooks/useActiveAccount";

interface StoryReaderFinishActionsProps {
  storyId?: string;
  hasQuiz?: boolean;
  isFinishing?: boolean;
  isFinished?: boolean;
  isAuthenticated?: boolean;
  onFinishStory?: () => void;
  onNavigateToQuiz?: () => void;
}

export const StoryReaderFinishActions: React.FC<
  StoryReaderFinishActionsProps
> = ({
  storyId,
  hasQuiz = false,
  isFinishing = false,
  isFinished = false,
  isAuthenticated: propIsAuthenticated,
  onFinishStory,
  onNavigateToQuiz,
}) => {
  const { isAuthenticated: hookIsAuthenticated } = useActiveAccount();
  const isAuthenticated = propIsAuthenticated ?? hookIsAuthenticated;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-100"
    >
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
        {/* 1. Finish Reading Button (Authenticated only) */}
        {isAuthenticated && (
          <button
            type="button"
            onClick={onFinishStory}
            disabled={isFinishing || isFinished}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              isFinished
                ? "bg-emerald-600 text-white cursor-default shadow-emerald-600/20"
                : "bg-[#7939E3] hover:bg-[#6824D6] text-white shadow-purple-500/20 hover:scale-105"
            }`}
          >
            {isFinishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري تسجيل إنهاء القصة...</span>
              </>
            ) : isFinished ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>تم إنهاء قراءة القصة بنجاح ✓</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>إنهاء قراءة القصة</span>
              </>
            )}
          </button>
        )}

        {/* 2. Test Yourself Button (Quiz) */}
        {hasQuiz && storyId && (
          <Link
            href={`/stories/${storyId}/quiz`}
            onClick={onNavigateToQuiz}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 bg-[#6D28D9] hover:bg-[#5B20B5] text-white shadow-purple-600/20 hover:scale-105 select-none cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>اختبر نفسك</span>
          </Link>
        )}

        {/* 3. Browse All Stories Button */}
        <Link
          href="/stories"
          className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xs hover:shadow-md active:scale-95 border-2 border-[#7939E3] text-[#7939E3] hover:bg-[#7939E3] hover:text-white select-none cursor-pointer duration-200"
        >
          <BookOpen className="w-5 h-5" />
          <span>تصفح كل القصص</span>
        </Link>
      </div>
    </motion.div>
  );
};
