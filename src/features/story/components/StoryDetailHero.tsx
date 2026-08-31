"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Story,
  getStoryQuizId,
  getSafeImageUrl,
  DEFAULT_BROKEN_IMAGE,
} from "../types";
import { FreeRosetteBadge } from "@/features/products/components/FreeRosetteBadge";
import { useStartStory } from "../hooks/useStartStory";

interface StoryDetailHeroProps {
  story: Story;
}

export const StoryDetailHero: React.FC<StoryDetailHeroProps> = ({ story }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { mutate: triggerStartStory } = useStartStory(story.id);

  // Safe image state with default broken image fallback
  const [coverSrc, setCoverSrc] = useState(() =>
    getSafeImageUrl(story.thumbnail_url || story.cover_photo_url)
  );
  const [bannerSrc, setBannerSrc] = useState(() =>
    getSafeImageUrl(story.cover_photo_url || story.thumbnail_url)
  );

  const totalPages =
    story.pages_count ??
    (story.blocks && story.blocks.length > 0 ? story.blocks.length : 1);

  const ageText =
    story.age_category && story.age_category !== "0-0"
      ? `${story.age_category} سنوات`
      : "4-6 سنوات";

  const storyCode = story.code || "Story 000-XXX";

  const descriptionText =
    story.description ??
    story.blocks?.find((b) => b.block_type === "text")?.content ??
    "قصة تعليمية ممتعة تنمي القيم الإيجابية وتثري المفردات اللغوية لدى الطفل بأسلوب شيق وجذاب.";

  const indicatorName =
    typeof story.indicator === "object" && story.indicator
      ? story.indicator.name
      : story.indicator || "يحدد الفكرة الرئيسية";

  const levelName =
    typeof story.level === "object" && story.level
      ? story.level.name
      : story.level || "الأول";

  const outcomeName =
    typeof story.outcome === "object" && story.outcome
      ? story.outcome.name
      : story.outcome || "توثيق مهارات";

  return (
    <div dir="rtl" className="w-full flex flex-col gap-6 sm:gap-8">
      {/* ══════════════════════════════════════════════
          1. Top Wide Story Banner Image (Full Width)
         ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-100 aspect-16/6 sm:aspect-21/7 md:aspect-24/7 h-150 max-h-150"
      >
        <Image
          src={bannerSrc}
          alt={story.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className="object-cover object-center"
          onError={() => setBannerSrc(DEFAULT_BROKEN_IMAGE)}
          unoptimized={bannerSrc === DEFAULT_BROKEN_IMAGE}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════
          2. Main Story Overview Card
         ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative w-full bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 sm:p-5 md:p-6 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 overflow-hidden"
      >
        {/* ── Right: Info Section ── */}
        <div className="flex-1 w-full flex flex-col text-right">
          {/* Top Row: Badges + Rosette */}
          <div className="flex items-center justify-between mb-3">
            {/* Free / Paid Rosette Badge (Right side in RTL) */}
            <div className="relative w-16 h-12 shrink-0">
              <FreeRosetteBadge
                availability={story.availability}
                className="static! top-auto! left-auto!"
              />
            </div>

            {/* Tags (Left side in RTL) */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-[#EBF7F5] text-[#0D9488] text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full select-none">
                {storyCode}
              </span>
              <span className="bg-[#F3E8FF] text-[#7E22CE] text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full select-none">
                {ageText}
              </span>
            </div>
          </div>

          {/* Story Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-extrabold text-mad-text-primary mb-2 leading-tight">
            {story.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-mad-text-secondary leading-relaxed mb-4 line-clamp-3 max-w-2xl">
            {descriptionText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {/* Indicator */}
            <div className="bg-[#F8F5FF] rounded-2xl py-3 px-4 flex flex-row-reverse items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center shrink-0">
                <Image
                  src="/iamges/storu-target.svg"
                  alt="المؤشر"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="text-right overflow-hidden flex-1 min-w-0">
                <span className="block text-[14px] text-mad-text-secondary font-bold mb-0.5">
                  المؤشر
                </span>
                <span className="block text-[14px] md:text-base font-extrabold text-mad-text-primary truncate">
                  {indicatorName}
                </span>
              </div>
            </div>

            {/* Level */}
            <div className="bg-[#F8F5FF] rounded-2xl py-3 px-4 flex flex-row-reverse items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center shrink-0">
                <Image
                  src="/iamges/story-cap.svg"
                  alt="المستوى"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="text-right overflow-hidden flex-1 min-w-0">
                <span className="block text-[12px] md:text-[14px] text-mad-text-secondary font-bold mb-0.5">
                  المستوى
                </span>
                <span className="block text-[14px] md:text-base font-extrabold text-mad-text-primary truncate">
                  {levelName}
                </span>
              </div>
            </div>

            {/* Outcome */}
            <div className="bg-[#F8F5FF] rounded-2xl py-3 px-4 flex flex-row-reverse items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center shrink-0">
                <Image
                  src="/iamges/story-result.svg"
                  alt="الناتج"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="text-right overflow-hidden flex-1 min-w-0">
                <span className="block text-[12px] md:text-[14px] text-mad-text-secondary font-bold mb-0.5">
                  الناتج
                </span>
                <span className="block text-[14px] md:text-base font-extrabold text-mad-text-primary truncate">
                  {outcomeName}
                </span>
              </div>
            </div>
          </div>

          {/* Number of Pages */}
          <div className="mb-4 flex items-center gap-2 mt-auto">
            <span className="text-xs text-[#94A3B8] font-bold">
              عدد الصفحات
            </span>
            <span className="text-sm font-black text-mad-text-primary">
              {totalPages} صفحة ممتعة
            </span>
          </div>

          {/* ── Action Buttons Row ── */}
          <div className="flex flex-wrap items-center gap-3 mt-auto">
            {/* 1. Start Reading */}
            <Link
              href={`/stories/${story.id}/read`}
              onClick={() => {
                triggerStartStory(undefined, {
                  onError: (err) => console.error("Start reading error:", err),
                });
              }}
              className="py-2.5 sm:py-3 px-6 rounded-full border-2 border-[#7939E3] text-[#7939E3] hover:bg-[#7939E3] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer select-none active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>ابدأ رحلة القراءة الآن</span>
            </Link>

            {/* 2. Solve the Quiz */}
            {getStoryQuizId(story) && (
              <Link
                href={`/stories/${story.id}/quiz`}
                className="py-2.5 sm:py-3 px-6 rounded-full bg-[#6D28D9] hover:bg-[#5B20B5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer select-none active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حل الاختبار</span>
              </Link>
            )}

            {/* 3. Download PDF */}
            {Boolean(story.pdf_url) && (
              <button
                type="button"
                disabled={isDownloading}
                onClick={async () => {
                  if (!story.pdf_url) {
                    toast.error("ملف PDF غير متوفر حالياً لهذه القصة");
                    return;
                  }

                  try {
                    setIsDownloading(true);
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
                    // Fallback: open directly in a new tab if CORS or direct download fails
                    window.open(story.pdf_url, "_blank", "noopener,noreferrer");
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                className="py-2.5 sm:py-3 px-6 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] disabled:opacity-75 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer select-none active:scale-95"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isDownloading ? "جاري التحميل..." : "تحميل PDF"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Left: Story Cover Illustration ── */}
        <div className="w-full lg:w-80 xl:w-88 shrink-0">
          <div className="relative w-full aspect-4/5 rounded-[22px] overflow-hidden shadow-md border border-slate-100 bg-slate-50">
            <Image
              src={coverSrc}
              alt={story.title}
              fill
              sizes="(max-width: 1024px) 100vw, 340px"
              className="object-cover"
              priority
              onError={() => setCoverSrc(DEFAULT_BROKEN_IMAGE)}
              unoptimized={coverSrc === DEFAULT_BROKEN_IMAGE}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoryDetailHero;
