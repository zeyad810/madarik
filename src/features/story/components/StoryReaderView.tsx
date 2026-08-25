"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Story, StoryBlock, getStoryQuizId } from "../types";
import { useFinishStory } from "../hooks/useFinishStory";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";

interface StoryReaderViewProps {
  story: Story;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({ story }) => {
  const { isFreeCustomer, isAuthenticated } = useActiveAccount();
  const canFinish = isAuthenticated && !isFreeCustomer;

  // Finish story mutation hook
  const { mutate: markStoryFinished, isPending: isFinishing, isSuccess: isFinished } =
    useFinishStory(story.id);

  // Track if story has been marked finished in this session
  const hasFinishedRef = useRef(false);

  // Extract and organize blocks into pages
  const blocks: StoryBlock[] =
    story.blocks && story.blocks.length > 0
      ? [...story.blocks].sort((a, b) => a.order - b.order)
      : [
          {
            id: "1",
            order: 1,
            block_type: "text",
            content:
              "في يوم من الأيام، كان هناك أرنب سريع يفتخر بسرعته أمام جميع الحيوانات. كان يتباهى دائماً ويقول: 'لا أحد يستطيع أن يسبقني!'",
          },
          {
            id: "2",
            order: 2,
            block_type: "image",
            content: "/assets/sea_story.png",
          },
          {
            id: "3",
            order: 3,
            block_type: "text",
            content:
              "ذات يوم، سمعت السلحفاة كلام الأرنب، فقالت له بهدوء: 'أنا أتحداك في سباق!' ضحك الأرنب كثيراً وقال: 'أنتِ؟ تتحدينني؟! هذا مستحيل!' لكن السلحفاة كانت واثقة من نفسها.",
          },
          {
            id: "4",
            order: 4,
            block_type: "text",
            content:
              "بدأ السباق، وانطلق الأرنب بسرعة كبيرة جداً حتى ابتعد كثيراً عن السلحفاة. نظر خلفه ولم يرها، فقرر أن يستريح تحت شجرة. قال لنفسه: 'السلحفاة بطيئة جداً، لدي وقت كافٍ للنوم.'",
          },
        ];

  // Divide blocks into pages (e.g. 2-3 blocks per page, or 1 page if short)
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.max(1, Math.ceil(blocks.length / ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);

  // Trigger finish when reaching the last page of multi-page story (only for non-free accounts)
  useEffect(() => {
    if (canFinish && totalPages > 1 && currentPage === totalPages && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      markStoryFinished();
    }
  }, [canFinish, currentPage, totalPages, markStoryFinished]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlocks = blocks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const lessonLearnedText =
    story.lesson_learned ||
    "المثابرة والصبر أهم من السرعة. العمل الجاد والمستمر يؤدي دائماً إلى النجاح، حتى لو كنت أبطأ من الآخرين.";

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* 1. Top Breadcrumb & Back */}
      <div className="mb-6">
        <AutoBreadcrumbs dynamicLabels={{ [story.id]: story.title }} />
      </div>

      {/* 2. Top Title Bar & Badges */}
      <div className="rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Right Info */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-xs font-bold px-3.5 py-1 rounded-full">
              مجانية
            </span>
            {story.code && (
              <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-bold px-3 py-1 rounded-full">
                {story.code}
              </span>
            )}
            {story.age_category && story.age_category !== "0-0" && (
              <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold px-3 py-1 rounded-full">
                {story.age_category} سنوات
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-mad-text-primary">
            {story.title}
          </h1>
        </div>

        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Direct Finish Reading Button (Hidden for Free Customers) */}
          {canFinish && (
            <button
              type="button"
              onClick={() => {
                hasFinishedRef.current = true;
                markStoryFinished();
              }}
              disabled={isFinishing || isFinished}
              className={`py-2.5 px-5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
                isFinished
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95 cursor-pointer"
              }`}
            >
              {isFinishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الإنهاء...</span>
                </>
              ) : isFinished ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تمت القراءة بنجاح ✓</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إنهاء القراءة</span>
                </>
              )}
            </button>
          )}

          {getStoryQuizId(story) && (
            <Link
              href={`/stories/${story.id}/quiz`}
              onClick={() => {
                if (canFinish && !hasFinishedRef.current) {
                  hasFinishedRef.current = true;
                  markStoryFinished();
                }
              }}
              className="py-2.5 px-5 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حل الاختبار</span>
            </Link>
          )}

          {story.pdf_url ? (
            <a
              href={story.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="py-2.5 px-5 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => alert("ملف PDF غير متوفر حالياً لهذه القصة")}
              className="py-2.5 px-5 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Story Content Box */}
      <div className="rounded-3xl p-6 sm:p-10 md:p-12 bg-white shadow-sm border border-slate-100">
        {/* Story Section Heading */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-mad-text-primary flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#7939E3]" />
            <span>محتوى القصة</span>
          </h2>
          {totalPages > 1 && (
            <span className="text-xs sm:text-sm font-bold text-[#7939E3] bg-purple-50 px-4 py-1.5 rounded-full">
              صفحة {currentPage} من {totalPages}
            </span>
          )}
        </div>

        {/* Animated Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 text-right"
          >
            {currentBlocks.map((block) => {
              if (block.block_type === "image") {
                const imgUrl =
                  block.content && !block.content.includes("via.placeholder.com")
                    ? block.content
                    : story.cover_photo_url &&
                      !story.cover_photo_url.includes("via.placeholder.com")
                    ? story.cover_photo_url
                    : "/assets/sea_story.png";

                return (
                  <div key={block.id} className="flex flex-col items-center my-4">
                    <div className="relative w-full aspect-video sm:aspect-21/9 max-h-105 rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                      <Image
                        src={imgUrl}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 850px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-400 font-semibold mt-2.5">
                      مشهد توضيحي من أحداث القصة
                    </span>
                  </div>
                );
              }

              return (
                <p
                  key={block.id}
                  className="text-base sm:text-lg md:text-xl text-[#334155] leading-loose font-medium"
                >
                  {block.content}
                </p>
              );
            })}

            {/* Lesson Learned & Completion Section (shown on the last page or on 1-page story) */}
            {currentPage === totalPages && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 mt-4"
              >
                {/* Lesson Learned Card */}
                <div className="bg-[#FAF5FF] border-2 border-[#E9D5FF] rounded-3xl p-6 sm:p-8 text-right">
                  <h3 className="text-lg sm:text-xl font-black text-[#7939E3] mb-3">
                    الدرس المستفاد
                  </h3>
                  <p className="text-sm sm:text-base text-[#475569] font-bold leading-relaxed">
                    {lessonLearnedText}
                  </p>
                </div>

                {/* Completion Status Badge (when finished or finishing, non-free accounts only) */}
                {canFinish && (isFinished || isFinishing) && (
                  <div className="flex items-center justify-center p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 gap-2.5">
                    {isFinishing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        <span className="text-sm font-bold">جاري تسجيل إنهاء القصة...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-bold">
                          أحسنت! لقد أكملت قراءة القصة بنجاح وتم تسجيل تقدمك 🎉
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Start Quiz CTA */}
                {getStoryQuizId(story) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="bg-[#6D28D9] rounded-3xl p-6 sm:p-8 text-center"
                  >
                    <p className="text-white/80 text-sm font-bold mb-3">
                      هل فهمت القصة جيداً؟ اختبر نفسك الآن!
                    </p>
                    <Link
                      href={`/stories/${story.id}/quiz`}
                      className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-white text-[#6D28D9] font-black text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      ابدأ الاختبار
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4. Bottom Controls: Finish Button for 1-Page Stories OR Pagination for Multi-Page */}
        {totalPages === 1 ? (
          (canFinish || getStoryQuizId(story)) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 pt-8 border-t border-slate-100">
              {canFinish && (
                <button
                  type="button"
                  onClick={() => {
                    hasFinishedRef.current = true;
                    markStoryFinished();
                  }}
                  disabled={isFinishing || isFinished}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md ${
                    isFinished
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95 cursor-pointer shadow-emerald-500/20"
                  }`}
                >
                  {isFinishing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري تسجيل إنهاء القصة...</span>
                    </>
                  ) : isFinished ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تمت القراءة بنجاح ✓</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>إنهاء قراءة القصة</span>
                    </>
                  )}
                </button>
              )}

              {getStoryQuizId(story) && (
                <Link
                  href={`/stories/${story.id}/quiz`}
                  onClick={() => {
                    if (canFinish && !hasFinishedRef.current) {
                      hasFinishedRef.current = true;
                      markStoryFinished();
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>الانتقال للاختبار</span>
                </Link>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 order-2 sm:order-1">
              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className="text-xs font-bold text-[#7939E3] hover:text-[#6824D6] hover:underline cursor-pointer py-1 px-3"
                >
                  الانتقال للصفحة الأخيرة ←
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 order-1 sm:order-2">
              {/* Next Page Button (Left arrow in RTL) */}
              <button
                type="button"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                aria-label="الصفحة التالية"
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                  currentPage === totalPages
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#7939E3] hover:bg-[#6824D6] text-white hover:scale-105 cursor-pointer"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <span className="text-sm font-black text-slate-700 select-none">
                {currentPage} / {totalPages}
              </span>

              {/* Previous Page Button (Right arrow in RTL) */}
              <button
                type="button"
                onClick={prevPage}
                disabled={currentPage === 1}
                aria-label="الصفحة السابقة"
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                  currentPage === 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#7939E3] hover:bg-[#6824D6] text-white hover:scale-105 cursor-pointer"
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-24 hidden sm:block order-3" />
          </div>
        )}
      </div>
    </div>
  );
};
