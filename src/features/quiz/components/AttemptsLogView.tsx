"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Trophy,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";

import { useQuizHistory } from "../hooks/useQuizHistory";
import { QuizHistoryItem } from "../types";

const ITEMS_PER_PAGE = 8;

/**
 * Returns an expressive emoji based on percentage/score.
 */
function getScoreEmoji(percentage: number): string {
  if (percentage >= 90) return "/iamges/love-Em.svg";
  if (percentage >= 85) return "/iamges/happy-Em.svg";
  if (percentage >= 70) return "/iamges/smile-Em.svg";
  if (percentage >= 40) return "/iamges/shocked-Em.svg";
  return "/iamges/sad-Em.svg";
}


/**
 * Formats date string to DD/MM/YYYY.
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "12/7/2026";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export const AttemptsLogView: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const { userRole, isAuthenticated, isLoading: isAccountLoading } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const isAllowed = role === "student" || role === "parent" || role === "child";

  // Data fetching
  const { data: historyResponse, isLoading, isError, refetch } = useQuizHistory();
  const rawAttempts = historyResponse?.data || [];

  // Always fetch fresh data on mount
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  // Filter States
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all");
  const [selectedIndicator, setSelectedIndicator] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Normalize attempts data from API and local storage
  const normalizedAttempts: QuizHistoryItem[] = useMemo(() => {
    return rawAttempts;
  }, [rawAttempts]);

  // Unique filter values
  const levelsList = useMemo(() => {
    const set = new Set<string>();
    normalizedAttempts.forEach((item) => {
      const lvl =
        typeof item.level === "string"
          ? item.level
          : (item.level as any)?.name || (item.story?.level as any)?.name || item.story?.level;
      if (lvl) set.add(lvl);
    });
    return Array.from(set);
  }, [normalizedAttempts]);

  const outcomesList = useMemo(() => {
    const set = new Set<string>();
    normalizedAttempts.forEach((item) => {
      const out = item.outcome || item.story?.outcome;
      if (out) set.add(out);
    });
    return Array.from(set);
  }, [normalizedAttempts]);

  const indicatorsList = useMemo(() => {
    const set = new Set<string>();
    normalizedAttempts.forEach((item) => {
      const ind = item.indicator || item.story?.indicator;
      if (ind) set.add(ind);
    });
    return Array.from(set);
  }, [normalizedAttempts]);

  // Filtered attempts
  const filteredAttempts = useMemo(() => {
    return normalizedAttempts.filter((item) => {
      const lvl =
        typeof item.level === "string"
          ? item.level
          : (item.level as any)?.name || (item.story?.level as any)?.name || item.story?.level;
      const out = item.outcome || item.story?.outcome;
      const ind = item.indicator || item.story?.indicator;

      if (selectedLevel !== "all" && lvl !== selectedLevel) return false;
      if (selectedOutcome !== "all" && out !== selectedOutcome) return false;
      if (selectedIndicator !== "all" && ind !== selectedIndicator) return false;
      return true;
    });
  }, [normalizedAttempts, selectedLevel, selectedOutcome, selectedIndicator]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAttempts.length / ITEMS_PER_PAGE));
  const paginatedAttempts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAttempts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAttempts, currentPage]);

  if (isAccountLoading || status === "loading" || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#7939E3]" />
        <p className="text-slate-600 font-bold text-sm">جاري تحميل سجل المحاولات...</p>
      </div>
    );
  }

  // If visitor or free_customer tries to access history directly
  if (!isAllowed) {
    return (
      <div
        dir="rtl"
        className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4"
      >
        <div className="size-20 rounded-full bg-purple-50 flex items-center justify-center text-[#7939E3]">
          <AlertCircle className="size-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center">
          سجل المحاولات متاح لطلاب ومشتركي المنصة فقط
        </h2>
        <p className="text-sm text-slate-500 font-medium text-center max-w-md">
          يمكنك تصفح وقراءة القصص المتاحة وخوض الاختبارات في أي وقت.
        </p>
        <Link
          href="/stories"
          className="py-3 px-8 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm transition-all shadow-md active:scale-95"
        >
          تصفح القصص
        </Link>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between relative overflow-hidden select-none bg-white"
    >
      {/* ─────────────────── TOP BREADCRUMB ─────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <AutoBreadcrumbs
          rootIcon={null}
          dynamicLabels={{ attempts: "سجل المحاولات", history: "نتائجي", results: "نتائجي" }}
        />
      </div>

      {/* ─────────────────── STAR-BG SECTION (below breadcrumb) ─────────────────── */}
      <div
        className="flex-1 flex flex-col"
        style={{ backgroundImage: "url('/iamges/star-bg.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
      >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4">

        {/* Heading */}
        <div className="flex flex-col items-center justify-center text-center mt-2 mb-8">
          <span className="text-xs sm:text-sm font-black text-[#7939E3] mb-1 tracking-wide">
            محاولاتي في الاختبارات
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B4B]">
            سجل المحاولات
          </h1>
        </div>

        {/* ─────────────────── CONDITIONAL CONTENT ─────────────────── */}
        {normalizedAttempts.length === 0 ? (
          /* ── Empty State matching user screenshot ── */
          <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-12 text-center gap-4">
            <div className="relative flex justify-center w-full max-w-sm">
              <Image
                src="/iamges/empty-history.png"
                alt="لم تقم بحل أي اختبار بعد"
                width={320}
                height={270}
                className="object-contain max-h-72 drop-shadow-sm"
                priority
              />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] mt-2">
              لم تقم بحل أي اختبار بعد
            </h3>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-8 rounded-full border border-[#7939E3] text-[#7939E3] hover:bg-purple-50 transition-all font-bold text-sm shadow-xs active:scale-95 cursor-pointer mt-1"
            >
              <span>العودة للرئيسية</span>
              <span className="text-base leading-none">←</span>
            </Link>
          </main>
        ) : (
          /* ── Filter Dropdowns & Main Table ── */
          <>
            {/* MAIN TABLE CONTAINER */}
            <main className="w-full pb-12 flex-1 flex flex-col items-center">

              {/* FILTERS — right aligned, ABOVE the table card */}
              <div className="w-full flex flex-wrap items-center justify-start gap-3 sm:gap-4 mb-4">
                  {/* 1. Level Filter */}
                  <div className="relative min-w-32.5 sm:min-w-37.5">
                    <select
                      value={selectedLevel}
                      onChange={(e) => {
                        setSelectedLevel(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none bg-white border border-mad-white-200 text-mad-text-secondary text-xs font-bold rounded-lg py-2 px-4 pr-4 pl-8 shadow-xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer text-right"
                    >
                      <option value="all">المستوى</option>
                      {levelsList.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* 2. Outcome Filter */}
                  <div className="relative min-w-32.5 sm:min-w-37.5">
                    <select
                      value={selectedOutcome}
                      onChange={(e) => {
                        setSelectedOutcome(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none bg-white border border-mad-white-200 text-mad-text-secondary text-xs font-bold rounded-lg py-2 px-4 pr-4 pl-8 shadow-xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer text-right"
                    >
                      <option value="all">الناتج</option>
                      {outcomesList.map((out) => (
                        <option key={out} value={out}>{out}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* 3. Indicator Filter */}
                  <div className="relative min-w-32.5 sm:min-w-37.5">
                    <select
                      value={selectedIndicator}
                      onChange={(e) => {
                        setSelectedIndicator(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none bg-white border border-mad-white-200 text-mad-text-secondary text-xs font-bold rounded-lg py-2 px-4 pr-4 pl-8 shadow-xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer text-right"
                    >
                      <option value="all">المؤشر</option>
                      {indicatorsList.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* TABLE CARD */}
              <div className="w-full bg-[#FAF8FF]/60 rounded-[28px] p-4 sm:p-6 lg:p-8 border border-purple-100/60 shadow-[0_10px_40px_rgba(121,57,227,0.04)]">
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-12 gap-2 text-center text-xs font-bold text-slate-400 px-6 py-3 select-none">
                  <span className="col-span-2 text-right pr-2">القصة</span>
                  <span className="col-span-1">المستوى</span>
                  <span className="col-span-1">الناتج</span>
                  <span className="col-span-2">المؤشر</span>
                  <span className="col-span-1">عدد المحاولات</span>
                  <span className="col-span-1">آخر نتيجة</span>
                  <span className="col-span-2">أعلى نتيجة</span>
                  <span className="col-span-1">القيمة العظمى</span>
                  <span className="col-span-1 text-left pl-2">تاريخ المحاولة</span>
                </div>

                {/* Table Rows */}
                <div className="flex flex-col gap-3 mt-2">
                  <AnimatePresence mode="popLayout">
                    {paginatedAttempts.map((row, idx) => {
                      const storyName = row.story_title || row.story?.title || "القصة";
                      const levelName =
                        typeof row.level === "string"
                          ? row.level
                          : (row.level as any)?.name || (row.story?.level as any)?.name || row.story?.level || "المستوى 3";
                      const outcomeName = row.outcome || row.story?.outcome || "يفهم القصة";
                      const indicatorName = row.indicator || row.story?.indicator || "يحلل الأحداث";
                      const attemptsCount = row.attempts_count || row.attempt_number || 1;
                      const lastScore = row.last_score ?? row.score ?? 0;
                      const highestScore = row.highest_score ?? row.score ?? 0;
                      const maxScore = 100;
                      const dateDisplay = formatDate(row.created_at);

                      const highestEmoji = getScoreEmoji(highestScore);
                      const isPurpleRow = idx % 2 === 0;

                      return (
                        <motion.div
                          key={row.id || `${storyName}-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.25, delay: idx * 0.04 }}
                          className={`rounded-[18px] px-5 sm:px-7 py-3.5 sm:py-4 transition-all duration-200 flex flex-col lg:grid lg:grid-cols-12 items-center gap-2.5 lg:gap-2 text-center text-xs sm:text-sm font-bold ${
                            isPurpleRow
                              ? "bg-[#6D28D9] text-white hover:bg-[#6020C7]"
                              : "bg-white text-slate-800 border border-purple-100 hover:border-purple-200"
                          }`}
                          style={{
                            boxShadow: isPurpleRow
                              ? "0px 4px 8px 0px #FFFFFF40 inset, 4px 0px 16px 0px #FFFFFF40 inset, 0px 4px 16px 0px #00000029"
                              : "0px 4px 8px 0px #6D28D90F inset, 4px 0px 16px 0px #6D28D90F inset, 0px 4px 32px 0px #00000014",
                          }}
                        >
                          {/* 1. Story Title */}
                          <div className="lg:col-span-2 flex items-center justify-center lg:justify-start gap-2 w-full truncate text-right">
                            <span className="shrink-0 text-base">
                              <Image
                                src="/iamges/book-story.svg"
                                alt="story"
                                width={20}
                                height={20}
                                className="w-4 h-4"
                              />
                            </span>
                            <span className="truncate font-black">
                              {storyName}
                            </span>
                          </div>

                          {/* 2. Level */}
                          <div className="lg:col-span-1 flex items-center justify-center gap-1">
                            <span className="text-yellow-400 text-sm">
                              <Image
                                src="/iamges/yellow-trophy-with-star-it.svg"
                                alt="trophy"
                                width={20}
                                height={20}
                                className="w-4 h-4"
                              />
                            </span>
                            <span
                              className={
                                isPurpleRow ? "text-white" : "text-[#7939E3] font-black"
                              }
                            >
                              {levelName}
                            </span>
                          </div>

                          {/* 3. Outcome */}
                          <div className="lg:col-span-1">
                            <span className={isPurpleRow ? "text-white/90" : "text-slate-700"}>
                              {outcomeName}
                            </span>
                          </div>

                          {/* 4. Indicator */}
                          <div className="lg:col-span-2">
                            <span className={isPurpleRow ? "text-white/90" : "text-slate-700"}>
                              {indicatorName}
                            </span>
                          </div>

                          {/* 5. Attempts Count */}
                          <div className="lg:col-span-1 font-black">
                            {attemptsCount}
                          </div>

                          {/* 6. Last Score */}
                          <div className="lg:col-span-1 font-black">
                            %{lastScore}
                          </div>

                          {/* 7. Highest Score + Emoji */}
                          <div className="lg:col-span-2 flex items-center justify-center gap-1.5 font-black text-sm">
                            <Image
                              src={highestEmoji}
                              alt="emoji"
                              width={24}
                              height={24}
                              className="w-6 h-6 shrink-0"
                            />
                            <span>%{highestScore}</span>
                          </div>

                          {/* 8. Max Score */}
                          <div className="lg:col-span-1 font-black">
                            %{maxScore}
                          </div>

                          {/* 9. Attempt Date */}
                          <div className="lg:col-span-1 flex items-center justify-center lg:justify-end gap-1.5 text-xs text-left">
                            <span className="text-sm">
                              <Image
                                src="/iamges/calender.svg"
                                alt="calendar"
                                width={20}
                                height={20}
                                className="w-4 h-4"
                              />
                            </span>
                            <span>{dateDisplay}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      <ChevronRight className="size-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`size-8 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-mad-third text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </main>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default AttemptsLogView;
