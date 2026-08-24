"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useQuizHistory } from "../hooks/useQuizHistory";
import { formatHistoryDate } from "../utils";

interface QuizHistoryProps {
  quizId: string;
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ quizId }) => {
  const { data, isLoading, isError } = useQuizHistory(quizId);
  const items = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm font-semibold">
        تعذر تحميل سجل الاختبارات
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <Image
          src="/iamges/q-trophy-circle.png"
          alt="لا توجد محاولات"
          width={72}
          height={72}
          className="opacity-40"
        />
        <p className="text-sm font-bold text-slate-400">لا توجد محاولات سابقة لهذا الاختبار</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <h3 className="text-base font-black text-mad-text-primary flex items-center gap-2">
        <Trophy className="w-4 h-4 text-[#FBBF24]" />
        سجل المحاولات
      </h3>

      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4"
        >
          {/* Left: attempt number */}
          <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-[#7939E3]">
              {item.attempt_number ?? idx + 1}
            </span>
          </div>

          {/* Center: date and title */}
          <div className="flex-1 text-right">
            <p className="text-sm font-bold text-mad-text-primary">
              {item.story_title ?? "اختبار"}
            </p>
            <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 justify-end">
              <Calendar className="w-3 h-3" />
              {formatHistoryDate(item.created_at)}
            </p>
          </div>

          {/* Right: score + pass/fail */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-mad-text-primary">
                {Math.round(item.percentage ?? ((item.score / (item.total_questions || 1)) * 100))}%
              </span>
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
              ) : (
                <XCircle className="w-4 h-4 text-[#F87171]" />
              )}
            </div>
            <span className="text-xs font-bold text-slate-400">
              {item.score}/{item.total_questions} صحيح
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuizHistory;
