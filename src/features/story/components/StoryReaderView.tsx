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
import { useStartStory } from "../hooks/useStartStory";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import toast from "react-hot-toast";

interface StoryReaderViewProps {
  story: Story;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({ story }) => {
  const { isAuthenticated } = useActiveAccount();

  const { mutate: markStoryStarted } = useStartStory(story.id);
  const { mutate: markStoryFinished, isPending: isFinishing, isSuccess: isFinished } =
    useFinishStory(story.id);

  // Track if story has been marked started / finished in this session
  const hasStartedRef = useRef(false);
  const hasFinishedRef = useRef(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Auto-record start of reading on reader view mount (once)
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      markStoryStarted(undefined, {
        onError: (err) => console.error("Start reading session error:", err),
      });
    }
  }, [markStoryStarted]);

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

  // Divide blocks into pages (e.g. 3 blocks per page, or 1 page if short)
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.max(1, Math.ceil(blocks.length / ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);

  // Handler for manually finishing story (for 1-page story button or top bar button)
  const handleFinishStory = () => {
    if (hasFinishedRef.current || isFinishing || isFinished) return;
    hasFinishedRef.current = true;
    markStoryFinished(undefined, {
      onSuccess: (res) => {
        toast.success(res?.message || "تم تسجيل إنهاء قراءة القصة بنجاح 🎉");
      },
      onError: (err: any) => {
        hasFinishedRef.current = false;
        toast.error(err?.message || "حدث خطأ أثناء تسجيل إنهاء القصة");
      },
    });
  };

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

      {/* 2. Top Title Bar & Badges (Matching Figma / Image 2) */}
      <div className="rounded-3xl p-4 sm:p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Right Info: Badges & Story Title */}
        <div className="text-right">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <span
              className={`text-xs font-bold px-3.5 py-0.5 rounded-full select-none ${
                story.availability === "paid"
                  ? "bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]"
                  : "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
              }`}
            >
              {story.availability === "paid" ? "مدفوعة" : "مجانية"}
            </span>
            {story.code && (
              <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-bold px-3.5 py-0.5 rounded-full select-none">
                {story.code}
              </span>
            )}
            {story.age_category && story.age_category !== "0-0" && (
              <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold px-3.5 py-0.5 rounded-full select-none">
                {story.age_category} سنوات
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-mad-text-primary">
            {story.title}
          </h1>
        </div>

        {/* Left Action Buttons: PDF (if available) & Quiz (if available) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. تحميل PDF (Only when pdf_url exists) */}
          {Boolean(story.pdf_url) && (
            <button
              type="button"
              disabled={isDownloadingPdf}
              onClick={async () => {
                if (!story.pdf_url) return;
                try {
                  setIsDownloadingPdf(true);
                  const res = await fetch(story.pdf_url);
                  if (!res.ok) throw new Error("Fetch error");
                  const blob = await res.blob();
                  const blobUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.style.display = "none";
                  a.href = blobUrl;
                  a.download = `${story.title || "قصة"}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(blobUrl);
                  toast.success("تم تحميل ملف PDF بنجاح");
                } catch {
                  window.open(story.pdf_url, "_blank", "noopener,noreferrer");
                } finally {
                  setIsDownloadingPdf(false);
                }
              }}
              className="py-2.5 px-5 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] disabled:opacity-75 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer select-none active:scale-95"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloadingPdf ? "جاري التحميل..." : "تحميل PDF"}</span>
            </button>
          )}

          {/* 2. حل الاختبار (Solid Purple Button - Only when quiz exists) */}
          {getStoryQuizId(story) && (
            <Link
              href={`/stories/${story.id}/quiz`}
              onClick={() => {
                if (!hasFinishedRef.current && !isFinished) {
                  handleFinishStory();
                }
              }}
              className="py-2.5 px-6 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer select-none hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حل الاختبار</span>
            </Link>
          )}
        </div>
      </div>

      {/* 3. Story Content Box */}
      <div className="rounded-3xl p-6 sm:p-10 md:p-12 bg-white shadow-xs border border-slate-100">
        {/* Story Section Centered Heading */}
        <div className="text-center pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-mad-text-primary inline-flex items-center gap-2">
            <span>محتوى القصة</span>
          </h2>
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
                  <div key={block.id} className="flex flex-col items-center my-4 w-full">
                    <div className="relative w-full aspect-video sm:aspect-21/9 max-h-110 rounded-3xl overflow-hidden shadow-md border border-slate-100">
                      <Image
                        src={imgUrl}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 950px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-semibold mt-2.5">
                      {story.title}
                    </span>
                  </div>
                );
              }

              return (
                <p
                  key={block.id}
                  className="text-base sm:text-lg md:text-xl text-[#334155] leading-loose font-medium text-right"
                >
                  {block.content}
                </p>
              );
            })}

            {/* Lesson Learned Section & Finish Action (shown on last page or 1-page story) */}
            {currentPage === totalPages && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6 mt-6"
              >
                {/* Lesson Learned Card */}
                <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-3xl p-6 sm:p-8 text-right">
                  <h3 className="text-lg sm:text-xl font-black text-[#7939E3] mb-3">
                    الدرس المستفاد
                  </h3>
                  <p className="text-sm sm:text-base text-[#475569] font-bold leading-relaxed">
                    {lessonLearnedText}
                  </p>
                </div>

                {/* Bottom Action Button for Finishing the Story */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleFinishStory}
                    disabled={isFinishing || isFinished}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                      isFinished
                        ? "bg-emerald-600 text-white cursor-default shadow-emerald-600/20"
                        : "bg-[#7939E3] hover:bg-[#6824D6] text-white shadow-purple-500/20 hover:scale-105"
                    }`}
                  >
                    {isFinishing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تسجيل إنهاء القصة...</span>
                      </>
                    ) : isFinished ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>تم إنهاء قراءة القصة بنجاح ✓</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>إنهاء قراءة القصة</span>
                      </>
                    )}
                  </button>

                  {getStoryQuizId(story) && (
                    <Link
                      href={`/stories/${story.id}/quiz`}
                      onClick={() => {
                        if (!hasFinishedRef.current && !isFinished) {
                          handleFinishStory();
                        }
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#6D28D9] hover:bg-[#5B20B5] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>الانتقال للاختبار</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4. Bottom Controls / Navigation Buttons using undo/redo SVGs matching Image 2 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10 pt-4">
            {/* Previous Page Button (Right in RTL) */}
            <button
              type="button"
              onClick={prevPage}
              disabled={currentPage === 1}
              aria-label="الصفحة السابقة"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                currentPage === 1
                  ? "bg-purple-200/50 cursor-not-allowed opacity-40"
                  : "bg-[#7939E3] hover:bg-[#6824D6] hover:scale-105 active:scale-95 cursor-pointer"
              }`}
            >
              <Image
                src="/iamges/redo.svg"
                alt="السابق"
                width={22}
                height={22}
                className="w-5 h-5"
              />
            </button>

            {/* Next Page Button (Left in RTL) */}
            <button
              type="button"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              aria-label="الصفحة التالية"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                currentPage === totalPages
                  ? "bg-purple-200/50 cursor-not-allowed opacity-40"
                  : "bg-[#7939E3] hover:bg-[#6824D6] hover:scale-105 active:scale-95 cursor-pointer"
              }`}
            >
              <Image
                src="/iamges/undo.svg"
                alt="التالي"
                width={22}
                height={22}
                className="w-5 h-5"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

