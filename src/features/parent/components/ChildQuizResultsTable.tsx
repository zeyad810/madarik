"use client";

import React from "react";
import { Download } from "lucide-react";
import { QuizResultRow } from "../types";
import { getScoreRating } from "../utils";

interface ChildQuizResultsTableProps {
  quizRows: QuizResultRow[];
  onExport?: () => void;
}

export const ChildQuizResultsTable: React.FC<ChildQuizResultsTableProps> = ({
  quizRows,
  onExport,
}) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-2 border-mad-white-200 shadow-xs space-y-6">
      {/* Section Header: Title (Right) + Export Button (Left) */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-mad-text-primary">
          نتائج الاختبارات والتقييم
        </h3>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 shrink-0 print:hidden"
        >
          <Download className="size-4 stroke-[2.2]" />
          <span>تصدير التقرير</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F8FAFC] text-mad-text-secondary text-xs sm:text-sm font-bold rounded-2xl">
              <th className="py-3.5 px-4 rounded-r-2xl text-right">
                اسم القصة
              </th>
              <th className="py-3.5 px-3 text-center">المستوى</th>
              <th className="py-3.5 px-3 text-center">الناتج</th>
              <th className="py-3.5 px-3 text-center">المؤشر والتقييم</th>
              <th className="py-3.5 px-3 text-center">المحاولات</th>
              <th className="py-3.5 px-3 text-center">آخر نتيجة</th>
              <th className="py-3.5 px-3 text-center">أعلى نتيجة</th>
              <th className="py-3.5 px-4 rounded-l-2xl text-center">
                القيمة العظمى
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quizRows.map((row, idx) => {
              const rating = getScoreRating(row.resultScore);
              const isEven = idx % 2 === 1;

              return (
                <tr
                  key={row.id}
                  className={`text-xs sm:text-sm transition-colors hover:bg-mad-purple-50/40 ${
                    isEven ? "bg-[#F9FAFB]/70" : "bg-white"
                  }`}
                >
                  {/* 1. Story Title */}
                  <td className="py-4 px-4 font-bold text-mad-text-primary">
                    {row.storyTitle}
                  </td>

                  {/* 2. Level */}
                  <td className="py-4 px-3 text-center text-mad-text-secondary font-medium">
                    {row.level}
                  </td>

                  {/* 3. Result Score */}
                  <td className="py-4 px-3 text-center font-extrabold text-mad-text-primary">
                    %{row.resultScore}
                  </td>

                  {/* 4. Rating Badge */}
                  <td className="py-4 px-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${rating.bgClass} ${rating.textClass}`}
                    >
                      {rating.label}
                    </span>
                  </td>

                  {/* 5. Attempts */}
                  <td className="py-4 px-3 text-center text-mad-text-secondary font-bold">
                    {row.attemptsCount}
                  </td>

                  {/* 6. Last Score */}
                  <td className="py-4 px-3 text-center font-bold text-mad-text-secondary">
                    %{row.lastScore}
                  </td>

                  {/* 7. Highest Score */}
                  <td className="py-4 px-3 text-center font-bold text-mad-text-secondary">
                    %{row.highestScore}
                  </td>

                  {/* 8. Max Score */}
                  <td className="py-4 px-4 text-center font-bold text-mad-text-secondary">
                    {row.maxScore}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChildQuizResultsTable;
