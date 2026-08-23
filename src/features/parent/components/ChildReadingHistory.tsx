"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { ReadingHistoryRow } from "../types";

interface ChildReadingHistoryProps {
  readingRows: ReadingHistoryRow[];
}

export const ChildReadingHistory: React.FC<ChildReadingHistoryProps> = ({
  readingRows,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-2 border-mad-white-200 shadow-xs space-y-4">
      <h3 className="text-lg sm:text-xl font-extrabold text-mad-text-primary text-right mb-4">
        سجل القراءة — آخر 5 قصص
      </h3>

      <div className="space-y-3">
        {readingRows.map((row) => {
          const isCompleted = row.status === "completed";

          return (
            <div
              key={row.id}
              className="w-full bg-white border border-mad-white-200/90 hover:border-mad-purple-200 hover:shadow-xs transition-all duration-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Right side in RTL: Story Title */}
              <div className="font-bold text-sm sm:text-base text-mad-text-primary text-right">
                {row.storyTitle}
              </div>

              {/* Middle: Date & Spent Duration */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-mad-text-secondary font-medium">
                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-mad-text-secondary stroke-[2]" />
                  <span>تاريخ القراءة: {row.dateText}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-mad-text-secondary stroke-[2]" />
                  <span>الوقت المنقضي: {row.durationMinutes} دقيقة</span>
                </div>
              </div>

              {/* Left side in RTL: Completion Status Badge */}
              <div className="self-start sm:self-center shrink-0">
                {isCompleted ? (
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                    مكتملة
                  </span>
                ) : (
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                    قيد القراءة
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChildReadingHistory;
