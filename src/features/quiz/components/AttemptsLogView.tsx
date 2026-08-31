"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";

import { useQuizHistory } from "../hooks/useQuizHistory";
import { QuizHistoryItem } from "../types";
import {
  AttemptsAccessDenied,
  AttemptsEmptyState,
  AttemptsFilterBar,
  AttemptsTableRow,
  AttemptsPagination,
} from "./attempts";

const ITEMS_PER_PAGE = 8;

export const AttemptsLogView: React.FC = () => {
  const { status } = useSession();
  const { userRole, isAuthenticated, isLoading: isAccountLoading } = useActiveAccount();

  const role = isAuthenticated ? (userRole || "visitor") : "visitor";
  const isAllowed = role === "student" || role === "parent" || role === "child";

  // Data fetching
  const { data: historyResponse, isLoading, refetch } = useQuizHistory();
  const rawAttempts = historyResponse?.data || [];

  // Always fetch fresh data on mount
  useEffect(() => {
    if (isAllowed) {
      refetch();
    }
  }, [isAllowed, refetch]);

  // Filter States
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all");
  const [selectedIndicator, setSelectedIndicator] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Normalize attempts data from API
  const normalizedAttempts: QuizHistoryItem[] = useMemo(() => {
    return rawAttempts;
  }, [rawAttempts]);

  // Unique filter values
  const levelsList = useMemo(() => {
    const set = new Set<string>();
    normalizedAttempts.forEach((item) => {
      const lvl =
        item.level_name ||
        (typeof item.level === "string"
          ? item.level
          : (item.level as any)?.name || (item.story?.level as any)?.name || item.story?.level);
      if (lvl) set.add(lvl);
    });
    return Array.from(set);
  }, [normalizedAttempts]);

  const outcomesList = useMemo(() => {
    const set = new Set<string>();
    normalizedAttempts.forEach((item) => {
      const out = item.outcome_name || item.outcome || item.story?.outcome;
      if (out) set.add(out);
    });
    return Array.from(set);
  }, [normalizedAttempts]);

  const indicatorsList = useMemo(() => {
    const set = new Set<string>();
    normalizedAttempts.forEach((item) => {
      const ind = item.indicator_name || item.indicator || item.story?.indicator;
      if (ind) set.add(ind);
    });
    return Array.from(set);
  }, [normalizedAttempts]);

  // Filtered attempts
  const filteredAttempts = useMemo(() => {
    return normalizedAttempts.filter((item) => {
      const lvl =
        item.level_name ||
        (typeof item.level === "string"
          ? item.level
          : (item.level as any)?.name || (item.story?.level as any)?.name || item.story?.level);
      const out = item.outcome_name || item.outcome || item.story?.outcome;
      const ind = item.indicator_name || item.indicator || item.story?.indicator;

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

  // If visitor or unauthorized tries to access history directly
  if (!isAllowed) {
    return <AttemptsAccessDenied />;
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

      {/* ─────────────────── MAIN CONTENT SECTION ─────────────────── */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bottom-37 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/iamges/star-bg.png"
            alt="stars background"
            width={1200}
            height={800}
            className="w-full max-w-5xl h-auto object-contain opacity-90"
            priority
          />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto w-full sm:px-6 lg:px-8 pt-6 pb-4">
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
            <AttemptsEmptyState />
          ) : (
            <main className="w-full pb-12 flex-1 flex flex-col items-center">
              {/* FILTERS */}
              <AttemptsFilterBar
                selectedLevel={selectedLevel}
                onLevelChange={(lvl) => {
                  setSelectedLevel(lvl);
                  setCurrentPage(1);
                }}
                levelsList={levelsList}
                selectedOutcome={selectedOutcome}
                onOutcomeChange={(out) => {
                  setSelectedOutcome(out);
                  setCurrentPage(1);
                }}
                outcomesList={outcomesList}
                selectedIndicator={selectedIndicator}
                onIndicatorChange={(ind) => {
                  setSelectedIndicator(ind);
                  setCurrentPage(1);
                }}
                indicatorsList={indicatorsList}
              />

              {/* TABLE CARD */}
              <div className="w-full bg-[#FAF8FF]/60 rounded-[28px] p-4 sm:p-6 lg:p-8 border border-purple-100/60 shadow-[0_10px_40px_rgba(121,57,227,0.04)]">
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-12 gap-2 text-center text-xs font-bold text-slate-400 px-6 py-3 select-none">
                  <span className="col-span-1 text-right pr-2">القصة</span>
                  <span className="col-span-2">المستوى</span>
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
                    {paginatedAttempts.map((row, idx) => (
                      <AttemptsTableRow
                        key={row.id || `${row.story_title || "story"}-${idx}`}
                        row={row}
                        idx={idx}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* PAGINATION */}
                <AttemptsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptsLogView;
