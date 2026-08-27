"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Download,
  GraduationCap,
  Sparkles,
  Target,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Story, getStoryQuizId } from "../types";
import { FreeRosetteBadge } from "@/features/products/components/FreeRosetteBadge";

interface StoryDetailHeroProps {
  story: Story;
}

export const StoryDetailHero: React.FC<StoryDetailHeroProps> = ({ story }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  // Safe Cover Image Resolution
  const rawCover = story.cover_photo_url || story.thumbnail_url;
  const isBrokenCover = !rawCover || rawCover.includes("via.placeholder.com");
  const coverImage = isBrokenCover ? "/assets/sea_story.png" : rawCover;

  // Safe Banner Image Resolution
  const rawBanner = story.cover_photo_url;
  const isBrokenBanner = !rawBanner || rawBanner.includes("via.placeholder.com");
  const bannerImage = isBrokenBanner ? "/assets/sea_story.png" : rawBanner;

  const totalPages =
    story.total_pages ??
    (story.blocks && story.blocks.length > 0 ? story.blocks.length : 12);

  const ageText =
    story.age_category && story.age_category !== "0-0"
      ? `${story.age_category} سنوات`
      : "4-6 سنوات";

  const storyCode = story.code || "Story 000-XXX";

  const descriptionText =
    story.description ??
    story.blocks?.find((b) => b.block_type === "text")?.content ??
    "قصة تعليمية ممتعة تنمي القيم الإيجابية وتثري المفردات اللغوية لدى الطفل بأسلوب شيق وجذاب.";

  return (
    <div dir="rtl" className="w-full flex flex-col gap-6 sm:gap-8">
      {/* 1. Top Wide Story Banner Image (Pure Image Banner as in Figma) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-100 aspect-16/6 sm:aspect-21/7 md:aspect-24/7 max-h-85"
      >
        <Image
          src={bannerImage}
          alt={story.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className="object-cover object-center"
        />
      </motion.div>

      {/* 2. Main Story Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative w-full bg-white rounded-4xl border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.05)] p-6 sm:p-8 md:p-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 overflow-hidden"
      >
        {/* Rosette Badge (Top Left in Card) - Paid or Free */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <FreeRosetteBadge availability={story.availability} />
        </div>

        {/* Right Info Section */}
        <div className="flex-1 w-full flex flex-col justify-between text-right">
          {/* Top Badges (Age & Story Code) */}
          <div className="flex items-center gap-2.5 mb-3">
            {/* Story Code Tag */}
            <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-bold px-3.5 py-1 rounded-full select-none">
              {storyCode}
            </span>

            {/* Age Badge */}
            <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold px-3.5 py-1 rounded-full select-none">
              {ageText}
            </span>
          </div>

          {/* Story Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-mad-text-primary mb-2 leading-tight">
            {story.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-mad-text-secondary leading-relaxed mb-6 line-clamp-3">
            {descriptionText}
          </p>

          {/* 3 Info Pill Items (المؤشر، المستوى، الناتج) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* 1. المؤشر (Indicator) */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100/80 flex items-center justify-center text-[#7939E3] shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-right overflow-hidden flex-1">
                <span className="block text-[11px] text-[#A855F7] font-bold">
                  المؤشر
                </span>
                <span className="block text-xs font-extrabold text-mad-text-primary truncate">
                  {typeof story.indicator === "object" && story.indicator
                    ? story.indicator.name
                    : story.indicator || "يحدد الفكرة الرئيسية"}
                </span>
              </div>
            </div>

            {/* 2. المستوى (Level) */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100/80 flex items-center justify-center text-[#7939E3] shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-right overflow-hidden flex-1">
                <span className="block text-[11px] text-[#A855F7] font-bold">
                  المستوى
                </span>
                <span className="block text-xs font-extrabold text-mad-text-primary truncate">
                  {typeof story.level === "object" && story.level
                    ? story.level.name
                    : story.level || "الأول"}
                </span>
              </div>
            </div>

            {/* 3. الناتج (Outcome) */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100/80 flex items-center justify-center text-[#7939E3] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-right overflow-hidden flex-1">
                <span className="block text-[11px] text-[#A855F7] font-bold">
                  الناتج
                </span>
                <span className="block text-xs font-extrabold text-mad-text-primary truncate">
                  {typeof story.outcome === "object" && story.outcome
                    ? story.outcome.name
                    : story.outcome || "توثيق مهارات"}
                </span>
              </div>
            </div>
          </div>

          {/* Number of Pages */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] font-bold">
              عدد الصفحات:
            </span>
            <span className="text-sm font-black text-mad-text-primary">
              {totalPages} صفحة ممتعة
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* 1. ابدأ رحلة القراءة الآن (Outline Purple Button) */}
            <Link
              href={`/stories/${story.id}/read`}
              className="py-2.5 sm:py-3 px-6 rounded-full border-2 border-[#7939E3] text-[#7939E3] hover:bg-[#7939E3] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer select-none active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>ابدأ رحلة القراءة الآن</span>
            </Link>

            {/* 2. حل الاختبار (Solid Violet Button — only when quiz exists) */}
            {getStoryQuizId(story) && (
              <Link
                href={`/stories/${story.id}/quiz`}
                className="py-2.5 sm:py-3 px-6 rounded-full bg-[#6D28D9] hover:bg-[#5B20B5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer select-none active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حل الاختبار</span>
              </Link>
            )}

            {/* 3. تحميل PDF (Solid Yellow/Amber Button - only if pdf_url exists) */}
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

        {/* Left Side Story Illustration (Square / Rounded) */}
        <div className="w-full lg:w-85 xl:w-95 aspect-square relative rounded-[28px] overflow-hidden shadow-md border border-slate-100 shrink-0">
          <Image
            src={coverImage}
            alt={story.title}
            fill
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </div>
  );
};

export default StoryDetailHero;
