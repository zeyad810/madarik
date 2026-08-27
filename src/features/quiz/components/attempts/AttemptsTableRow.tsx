import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { QuizHistoryItem } from "../../types";

function getScoreEmoji(percentage: number): string {
  if (percentage >= 90) return "/iamges/love-Em.svg";
  if (percentage >= 85) return "/iamges/happy-Em.svg";
  if (percentage >= 70) return "/iamges/smile-Em.svg";
  if (percentage >= 40) return "/iamges/shocked-Em.svg";
  return "/iamges/sad-Em.svg";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
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

interface AttemptsTableRowProps {
  row: QuizHistoryItem;
  idx: number;
}

export const AttemptsTableRow: React.FC<AttemptsTableRowProps> = ({ row, idx }) => {
  const storyName = row.story_title || row.story?.title || "القصة";
  const levelName =
    row.level_name ||
    (typeof row.level === "string"
      ? row.level
      : (row.level as any)?.name || (row.story?.level as any)?.name || row.story?.level || "-");
  const outcomeName = row.outcome_name || row.outcome || row.story?.outcome || "-";
  const indicatorName = row.indicator_name || row.indicator || row.story?.indicator || "-";
  const attemptsCount = row.attempts_count || row.attempt_number || 1;
  const lastScore = row.last_score_percentage ?? row.last_score ?? row.score ?? 0;
  const highestScore = row.highest_score_percentage ?? row.highest_score ?? row.score ?? 0;
  const maxScore = 100;
  const dateDisplay = formatDate(row.last_attempt_at || row.created_at);

  const highestEmoji = getScoreEmoji(highestScore);
  const isPurpleRow = idx % 2 === 0;

  return (
    <motion.div
      key={row.id || `${storyName}-${idx}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className={`rounded-3xl lg:rounded-[18px] p-5 sm:p-6 lg:px-7 lg:py-4 transition-all duration-200 text-xs sm:text-sm font-bold ${
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
      {/* ═══════════════ MOBILE VIEW (lg:hidden) ═══════════════ */}
      <div className="flex flex-col gap-4 lg:hidden w-full text-right">
        {/* 1. Header: Story Title + Level Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src="/iamges/book-story.svg"
              alt="story"
              width={18}
              height={18}
              className="shrink-0 w-4 h-4"
            />
            <span className="font-black text-sm sm:text-base truncate">
              {storyName}
            </span>
          </div>

          <div
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isPurpleRow
                ? "bg-white/20 text-white"
                : "bg-[#F3E8FF] text-[#7939E3]"
            }`}
          >
            <Image
              src="/iamges/yellow-trophy-with-star-it.svg"
              alt="trophy"
              width={14}
              height={14}
              className="w-3.5 h-3.5"
            />
            <span>{levelName}</span>
          </div>
        </div>

        {/* 2. Middle Row: Meta details */}
        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Image
                src="/iamges/calender.svg"
                alt="calendar"
                width={14}
                height={14}
                className="w-3.5 h-3.5"
              />
              <span className={isPurpleRow ? "text-white/90" : "text-slate-600"}>
                {dateDisplay}
              </span>
            </div>
            <div>
              <span className={isPurpleRow ? "text-white/70" : "text-slate-400"}>المحاولات: </span>
              <span className="font-black">{attemptsCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="truncate max-w-[55%]">
              <span className={isPurpleRow ? "text-white/70" : "text-slate-400"}>المؤشر: </span>
              <span className={isPurpleRow ? "text-white" : "text-slate-700"}>{indicatorName}</span>
            </div>
            <div className="truncate max-w-[45%] text-left">
              <span className={isPurpleRow ? "text-white/70" : "text-slate-400"}>الناتج: </span>
              <span className={isPurpleRow ? "text-white" : "text-slate-700"}>{outcomeName}</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Scores (3 Columns) */}
        <div className="grid grid-cols-3 items-center justify-between text-center pt-3 border-t border-white/10">
          {/* Max Score */}
          <div className="flex flex-col items-center justify-center">
            <span className={`text-[11px] font-bold ${isPurpleRow ? "text-white/70" : "text-slate-400"}`}>
              العظمى
            </span>
            <span className="text-sm sm:text-base font-black">
              %{maxScore}
            </span>
          </div>

          {/* Highest Score */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-1 font-black text-sm sm:text-base">
              <Image
                src={highestEmoji}
                alt="emoji"
                width={20}
                height={20}
                className="w-4.5 h-4.5 shrink-0"
              />
              <span className={isPurpleRow ? "text-yellow-300" : "text-[#7939E3]"}>
                %{highestScore}
              </span>
            </div>
            <span className={`text-[11px] font-bold ${isPurpleRow ? "text-white/70" : "text-slate-400"}`}>
              أعلى نتيجة
            </span>
          </div>

          {/* Last Score */}
          <div className="flex flex-col items-center justify-center">
            <span className={`text-[11px] font-bold ${isPurpleRow ? "text-white/70" : "text-slate-400"}`}>
              آخر نتيجة
            </span>
            <span className="text-sm sm:text-base font-black">
              %{lastScore}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP VIEW (hidden lg:grid) ═══════════════ */}
      <div className="hidden lg:grid lg:grid-cols-12 items-center gap-2 text-center w-full">
        {/* 1. Story Title */}
        <div className="lg:col-span-1 flex items-center justify-start gap-2 w-full truncate text-right">
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
        <div className="lg:col-span-2 flex items-center justify-center gap-1">
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
        <div className="lg:col-span-1 flex items-center justify-end gap-1.5 text-xs text-left">
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
      </div>
    </motion.div>
  );
};
