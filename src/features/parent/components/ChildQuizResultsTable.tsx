"use client";

import React from "react";
import { Download } from "lucide-react";
import { QuizResultRow } from "../types";
import { getScoreRating } from "../utils";

interface ChildQuizResultsTableProps {
  quizRows?: QuizResultRow[];
  childName?: string;
  onExport?: () => void;
}

export const ChildQuizResultsTable: React.FC<ChildQuizResultsTableProps> = ({
  quizRows = [],
  childName,
  onExport,
}) => {
  const displayRows = quizRows;
  const hasData = displayRows && displayRows.length > 0;

  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }

    if (typeof window === "undefined" || !displayRows || displayRows.length === 0) return;

    // Create an isolated printable frame to export ONLY the evaluation table
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (!frameDoc) return;

    const ratingColors: Record<string, { bg: string; text: string; border: string }> = {
      "مميز": { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" },
      "جيد جداً": { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" },
      "جيد": { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
      "مقبول": { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" },
      "بحاجة لتحسين": { bg: "#FFE4E6", text: "#BE123C", border: "#FECDD3" },
    };

    const rowsHtml = displayRows
      .map((row, idx) => {
        const rating = getScoreRating(row.resultScore);
        const style = ratingColors[rating.label] || { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };
        const rowBg = idx % 2 === 1 ? "#F9FAFB" : "#FFFFFF";

        return `
        <tr style="background-color: ${rowBg};">
          <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-weight: bold; text-align: right; color: #1E293B;">
            ${row.story?.title || row.storyTitle}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #64748B;">
            ${row.level || "—"}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: 800; color: #7939E3;">
            %${row.resultScore}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">
            <span style="display: inline-block; padding: 3px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background-color: ${style.bg}; color: ${style.text}; border: 1px solid ${style.border};">
              ${rating.label}
            </span>
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: 700; color: #475569;">
            ${row.attemptsCount}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: 700; color: #475569;">
            %${row.lastScore}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: 700; color: #475569;">
            %${row.highestScore}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: 700; color: #64748B;">
            ${row.maxScore}
          </td>
        </tr>
      `;
      })
      .join("");

    const dateFormatted = new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>تقرير نتائج الاختبارات والتقييم - ${childName || "مدارك القراءة"}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 12mm 15mm;
            }
            * {
              box-sizing: border-box;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            body {
              margin: 0;
              padding: 15px;
              color: #1e293b;
              background: #ffffff;
            }
            .header-box {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2.5px solid #7939E3;
              padding-bottom: 14px;
              margin-bottom: 16px;
            }
            .title {
              font-size: 22px;
              font-weight: 800;
              color: #0F172A;
              margin: 0 0 4px 0;
            }
            .child-badge {
              display: inline-block;
              background-color: #F3E8FF;
              color: #6D28D9;
              font-weight: 700;
              font-size: 13px;
              padding: 3px 12px;
              border-radius: 9999px;
            }
            .platform-info {
              text-align: left;
              font-size: 12px;
              color: #64748B;
              line-height: 1.5;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              font-size: 12.5px;
            }
            thead th {
              background-color: #F8FAFC;
              color: #475569;
              font-weight: 800;
              padding: 11px 10px;
              border-bottom: 2px solid #CBD5E1;
            }
            .footer-note {
              margin-top: 24px;
              text-align: center;
              font-size: 11px;
              color: #94A3B8;
              border-top: 1px solid #F1F5F9;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            <div>
              <h1 class="title">تقرير نتائج الاختبارات والتقييم</h1>
              ${childName ? `<div class="child-badge">اسم الطفل: ${childName}</div>` : ""}
            </div>
            <div class="platform-info">
              <strong style="color: #7939E3; font-size: 14px;">منصة مدارك القراءة</strong>
              <div>تاريخ التصدير: ${dateFormatted}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: right; border-radius: 0 8px 8px 0;">اسم القصة</th>
                <th style="text-align: center;">المستوى</th>
                <th style="text-align: center;">الناتج</th>
                <th style="text-align: center;">المؤشر والتقييم</th>
                <th style="text-align: center;">المحاولات</th>
                <th style="text-align: center;">آخر نتيجة</th>
                <th style="text-align: center;">أعلى نتيجة</th>
                <th style="text-align: center; border-radius: 8px 0 0 8px;">القيمة العظمى</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer-note">
            تم استخراج هذا التقرير تلقائياً عبر منصة مدارك القراءة © ${new Date().getFullYear()}
          </div>
        </body>
      </html>
    `;

    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1500);
    }, 250);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-2 border-mad-white-200 shadow-xs space-y-6 select-none" dir="rtl">
      {/* Section Header: Title (Right) + Export Button (Left) */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-mad-text-primary">
          نتائج الاختبارات والتقييم
        </h3>

        {hasData && (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 shrink-0 print:hidden"
          >
            <Download className="size-4 stroke-[2.2]" />
            <span>تصدير التقرير</span>
          </button>
        )}
      </div>

      {hasData ? (
        /* Table Container */
        <div className="w-full overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-mad-text-secondary text-xs sm:text-sm font-bold rounded-2xl">
                <th className="py-3.5 px-4 rounded-r-2xl text-right">اسم القصة</th>
                <th className="py-3.5 px-3 text-center">المستوى</th>
                <th className="py-3.5 px-3 text-center">الناتج</th>
                <th className="py-3.5 px-3 text-center">المؤشر والتقييم</th>
                <th className="py-3.5 px-3 text-center">المحاولات</th>
                <th className="py-3.5 px-3 text-center">آخر نتيجة</th>
                <th className="py-3.5 px-3 text-center">أعلى نتيجة</th>
                <th className="py-3.5 px-4 rounded-l-2xl text-center">القيمة العظمى</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayRows.map((row, idx) => {
                const rating = getScoreRating(row.resultScore);
                const isEven = idx % 2 === 1;

                return (
                  <tr
                    key={`${row.id}-${idx}`}
                    className={`text-xs sm:text-sm transition-colors hover:bg-mad-purple-50/40 ${
                      isEven ? "bg-[#F9FAFB]/70" : "bg-white"
                    }`}
                  >
                    {/* 1. Story Title */}
                    <td className="py-4 px-4 font-bold text-mad-text-primary">
                      {row.story?.title || row.storyTitle}
                    </td>

                    {/* 2. Level */}
                    <td className="py-4 px-3 text-center text-mad-text-secondary font-medium">
                      {row.level || "—"}
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
      ) : (
        /* Empty State */
        <div className="py-10 sm:py-12 px-4 flex flex-col items-center justify-center text-center">
          {/* Circular Badge with 3D Question Cards Icon */}
          <div className="size-16 sm:size-20 rounded-full bg-[#FAF5FF] border border-[#EDE9FE] ring-8 ring-[#FAF8FF] flex items-center justify-center mb-4 shadow-2xs">
            <svg
              className="size-8 sm:size-9"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="rotate(-12 20 26)">
                <rect
                  x="8"
                  y="12"
                  width="18"
                  height="22"
                  rx="4"
                  fill="url(#orangeGrad)"
                  filter="drop-shadow(0 2px 4px rgba(245, 158, 11, 0.25))"
                />
                <text
                  x="17"
                  y="28"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  ?
                </text>
              </g>
              <g transform="rotate(10 28 24)">
                <rect
                  x="20"
                  y="10"
                  width="20"
                  height="24"
                  rx="4"
                  fill="url(#purpleGrad)"
                  filter="drop-shadow(0 4px 6px rgba(109, 40, 217, 0.3))"
                />
                <text
                  x="30"
                  y="27"
                  textAnchor="middle"
                  fill="white"
                  fontSize="15"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  ?
                </text>
              </g>
              <defs>
                <linearGradient
                  id="orangeGrad"
                  x1="8"
                  y1="12"
                  x2="26"
                  y2="34"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FBBF24" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient
                  id="purpleGrad"
                  x1="20"
                  y1="10"
                  x2="40"
                  y2="34"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h4 className="text-base sm:text-lg font-extrabold text-mad-text-primary mb-1.5 tracking-tight">
            لم يتم تسجيل أي نشاط اختبارات بعد لهذه الفئة
          </h4>

          <p className="text-xs sm:text-sm text-mad-text-secondary font-normal max-w-md leading-relaxed">
            عندما يبدأ الطفل بقراءة قصص جديدة وخوض التقييمات، ستظهر النتائج والتقارير التفصيلية هنا تلقائياً.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChildQuizResultsTable;
