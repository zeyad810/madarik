"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import type { QuizResultData } from "../types";

interface QuizResultProps {
  result: QuizResultData;
  storyId: string;
  storyTitle?: string;
  userRole: string;
  onRetry?: () => void;
}

function formatTimeTaken(seconds?: number): string {
  if (typeof seconds !== "number" || seconds <= 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  result,
  storyId,
  storyTitle,
  userRole,
  onRetry,
}) => {
  const resolvedStoryTitle = storyTitle || (result as any)?.story_title || "القصة";
  const total = result.total_questions || 1;
  const correct = result.correct_answers ?? result.score ?? 0;
  const percentage = Math.round(
    result.percentage ?? ((correct / total) * 100)
  );
  const passingScore = result.passing_score ?? 50;
  const passed = result.passed ?? percentage >= passingScore;

  // Star calculation (out of 5)
  const starCount = Math.min(5, Math.max(0, Math.round((percentage / 100) * 5)));

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between bg-white relative overflow-hidden"
    >
      {/* ─────────────────── TOP BREADCRUMBS ─────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <AutoBreadcrumbs
          rootIcon={null}
          dynamicLabels={{
            [storyId]: resolvedStoryTitle,
            quiz: "نتيجة الاختبار",
          }}
        />
      </div>

      {/* ─────────────────── MAIN CONTENT AREA ─────────────────── */}
      <div className="relative flex-1 flex flex-col justify-center overflow-hidden">
        {/* Confetti Background Texture — Only on success and placed below the breadcrumbs */}
        {passed && (
          <div
            className="absolute inset-0 pointer-events-none bg-[url('/iamges/q-quiz-results-bg.png')] bg-contain bg-center opacity-80"
            aria-hidden="true"
          />
        )}

        <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col items-center justify-center gap-6 text-center">
          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-1"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B4B]">
              {passed ? "أحسنت يا بطل" : "لنحاول مرة أخرى"}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-slate-500">
              {passed
                ? "لقد أنجزت من الاختبار بنجاح"
                : "أعد تجربة الاختبار"}
            </p>
          </motion.div>

        {/* 3D Character Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex justify-center w-full max-w-md"
        >
          <Image
            src={
              passed
                ? "/iamges/q-quiz-done.png"
                : "/iamges/q-fail-quiz.png"
            }
            alt={passed ? "أحسنت" : "لنحاول مرة أخرى"}
            width={340}
            height={280}
            style={{ width: "auto", height: "auto" }}
            className="object-contain max-h-64 sm:max-h-72 drop-shadow-md"
            priority
          />
        </motion.div>

        {/* ── Top Score & Stars Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-[28px] py-5 px-8 sm:px-12 shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col items-center gap-2 min-w-[240px]"
        >
          {/* 5 Stars — Only on passed */}
          {passed && (
            <div className="flex items-center gap-1 text-[#FBBF24]" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= starCount
                      ? "fill-[#FBBF24] text-[#FBBF24]"
                      : "fill-slate-200 text-slate-200"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Big Score */}
          <div className="text-3xl sm:text-4xl font-black text-[#7939E3] leading-tight">
            {correct} من {total}
          </div>

          {/* Percentage */}
          <div className="text-sm sm:text-base font-black text-[#1E1B4B]">
            {percentage}%
          </div>
        </motion.div>

        {/* ── 4 Stats Grid Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-[28px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0"
        >
          {/* 1. Correct Answers */}
          <div className="flex flex-col items-center gap-2 px-4 py-2 md:border-l md:border-slate-100">
            <Image
              src="/iamges/q-correct-answer.png"
              alt="الإجابات الصحيحة"
              width={42}
              height={42}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-xs font-bold text-slate-500">
              الإجابات الصحيحة
            </span>
            <span className="text-base sm:text-lg font-black text-slate-800">
              {correct} من {total}
            </span>
          </div>

          {/* 2. Best Score */}
          <div className="flex flex-col items-center gap-2 px-4 py-2 md:border-l md:border-slate-100">
            <Image
              src="/iamges/q-best-answer.png"
              alt="أفضل نتيجة"
              width={42}
              height={42}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-xs font-bold text-slate-500">أفضل نتيجة</span>
            <span className="text-base sm:text-lg font-black text-slate-800">
              {percentage}%
            </span>
          </div>

          {/* 3. Earned Points */}
          <div className="flex flex-col items-center gap-2 px-4 py-2 md:border-l md:border-slate-100">
            <Image
              src="/iamges/q-earned-point.png"
              alt="النقاط المكتسبة"
              width={42}
              height={42}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-xs font-bold text-slate-500">
              النقاط المكتسبة
            </span>
            <span className="text-base sm:text-lg font-black text-slate-800">
              {passed ? `+${correct * 20} نقطة` : "0 نقطة"}
            </span>
          </div>

          {/* 4. Time Taken */}
          <div className="flex flex-col items-center gap-2 px-4 py-2">
            <Image
              src="/iamges/q-time-taked.png"
              alt="الوقت المستغرق"
              width={42}
              height={42}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-xs font-bold text-slate-500">
              الوقت المستغرق
            </span>
            <span className="text-base sm:text-lg font-black text-slate-800">
              {formatTimeTaken(result.time_taken)}
            </span>
          </div>
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-2 mb-6"
        >
          {/* Back to Story */}
          <Link
            href={`/stories/${storyId}`}
            className="flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>العودة للقصة</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Retry Button */}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-white border-2 border-[#7939E3] text-[#7939E3] hover:bg-purple-50 font-bold text-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          )}
        </motion.div>
      </main>
      </div>
    </div>
  );
};

export default QuizResult;
