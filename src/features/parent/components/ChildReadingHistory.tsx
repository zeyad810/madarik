"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { ReadingHistoryRow } from "../types";

interface ChildReadingHistoryProps {
  readingRows?: ReadingHistoryRow[];
}

export const ChildReadingHistory: React.FC<ChildReadingHistoryProps> = ({
  readingRows = [],
}) => {
  const displayRows = readingRows;

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-2 border-mad-white-200 shadow-xs space-y-4">
      <h3 className="text-lg sm:text-xl font-extrabold text-mad-text-primary text-right mb-4">
        سجل القراءة — آخر 5 قصص
      </h3>

      {displayRows.length > 0 ? (
        <div className="space-y-3">
          {displayRows.map((row, index) => {
            const isCompleted = row.status === "completed";

            return (
              <div
                key={`${row.id}-${index}`}
                className="w-full bg-white border border-mad-white-200/90 hover:border-mad-purple-200 hover:shadow-xs transition-all duration-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Right side in RTL: Story Title */}
                <div className="font-bold text-sm sm:text-base text-mad-text-primary text-right flex items-center gap-4">
                  {row.story?.title || row.storyTitle}

                  {/* Middle: Date & Spent Duration */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-mad-text-secondary font-medium">
                    {/* Date */}
                    {row.dateText && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-mad-text-secondary stroke-2" />
                        <span>تاريخ القراءة: {row.dateText}</span>
                      </div>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-mad-text-secondary stroke-2" />
                      <span>الوقت المنقضي: {row.durationMinutes || 0} دقيقة</span>
                    </div>
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
      ) : (
        /* Empty State */
        <div className="py-10 sm:py-12 px-4 flex flex-col items-center justify-center text-center">
          {/* Circular Badge with Book Icon */}
          <div className="size-16 sm:size-20 rounded-full bg-[#FAF5FF] border border-[#EDE9FE] ring-8 ring-[#FAF8FF] flex items-center justify-center mb-4 shadow-2xs">
            <svg
              className="size-8 sm:size-9 text-mad-main"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
          </div>

          <h4 className="text-base sm:text-lg font-extrabold text-mad-text-primary mb-1.5 tracking-tight">
            لم يتم تسجيل أي نشاط قراءة بعد لهذا الطفل
          </h4>

          <p className="text-xs sm:text-sm text-mad-text-secondary font-normal max-w-md leading-relaxed">
            عندما يبدأ الطفل بقراءة القصص والتفاعل معها، ستظهر تفاصيل القراءة وسجل الأنشطة هنا تلقائياً.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChildReadingHistory;
