"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Download,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { Story } from "../types";

interface StoryDetailHeroProps {
  story: Story;
}

export const StoryDetailHero: React.FC<StoryDetailHeroProps> = ({ story }) => {
  const coverImage =
    story.cover_photo_url &&
    !story.cover_photo_url.includes("via.placeholder.com")
      ? story.cover_photo_url
      : story.thumbnail_url &&
          !story.thumbnail_url.includes("via.placeholder.com")
        ? story.thumbnail_url
        : "/assets/sea_story.png";

  const totalPages =
    story.total_pages ??
    (story.blocks && story.blocks.length > 0 ? story.blocks.length : 12);

  const ageText =
    story.age_category && story.age_category !== "0-0"
      ? `${story.age_category} سنوات`
      : "جميع الأعمار";

  return (
    <div dir="rtl" className="w-full flex flex-col gap-6">
      {/* 1. Top Wide Illustrated Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-linear-to-r from-[#e0f2fe] via-[#fef3c7] to-[#fed7aa] min-h-[160px] sm:min-h-[200px] flex items-center justify-center p-6 text-center"
      >
        <div className="relative z-10">
          <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706] bg-white/80 backdrop-blur-xs px-4 py-1 rounded-full mb-2 shadow-xs">
            القصة المتميزة
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-mad-text-primary mb-2 leading-tight">
            {story.title}
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#78350F]">
            رحلة ممتعة في عالم القيم والمهارات!
          </p>
        </div>
      </motion.div>

      {/* 2. Main Story Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full bg-white rounded-4xl border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-6 sm:p-8 md:p-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-8"
      >
        {/* Right Info Section */}
        <div className="flex-1 w-full flex flex-col justify-between">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Free/Paid Badge */}
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                story.availability === "free" || !story.availability
                  ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                  : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
              }`}
            >
              {story.availability === "free" || !story.availability
                ? "مجاني"
                : "مدفوع"}
            </span>

            {/* Code Tag */}
            {story.code && (
              <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-bold px-3.5 py-1.5 rounded-full">
                {story.code}
              </span>
            )}

            {/* Age Badge */}
            <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold px-4 py-1.5 rounded-full">
              {ageText}
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-mad-text-primary mb-3 leading-snug">
            {story.title}
          </h2>
          <p className="text-sm sm:text-base text-mad-text-secondary leading-relaxed mb-6">
            {story.description ||
              story.blocks?.find((b) => b.block_type === "text")?.content ||
              "قصة تعليمية ممتعة تنمي القيم الإيجابية وتثري المفردات اللغوية لدى الطفل بأسلوب شيق وجذاب."}
          </p>

          {/* 3 Info Pill Items (المؤشر، المستوى، الناتج) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {/* Indicator */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#7939E3] shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-right overflow-hidden">
                <span className="block text-[11px] text-[#A855F7] font-bold">
                  المؤشر
                </span>
                <span className="block text-xs font-extrabold text-mad-text-primary truncate">
                  {story.indicator || "يحدد الفكرة الرئيسية"}
                </span>
              </div>
            </div>

            {/* Level */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#7939E3] shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-right overflow-hidden">
                <span className="block text-[11px] text-[#A855F7] font-bold">
                  المستوى
                </span>
                <span className="block text-xs font-extrabold text-mad-text-primary truncate">
                  {story.level || "المستوى الأول"}
                </span>
              </div>
            </div>

            {/* Outcome */}
            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#7939E3] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-right overflow-hidden">
                <span className="block text-[11px] text-[#A855F7] font-bold">
                  الناتج
                </span>
                <span className="block text-xs font-extrabold text-mad-text-primary truncate">
                  {story.outcome || "توثيق مهارات"}
                </span>
              </div>
            </div>
          </div>

          {/* Number of Pages */}
          <div className="mb-6 flex items-center gap-2 text-right">
            <span className="text-xs text-[#94A3B8] font-bold">
              عدد الصفحات:
            </span>
            <span className="text-sm font-black text-[#7939E3]">
              {totalPages} صفحة ممتعة
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            {/* Start Reading Button */}
            <Link
              href={`/stories/${story.id}/read`}
              className="flex-1 min-w-45 py-3.5 px-6 rounded-full border-2 border-[#7939E3] text-[#7939E3] hover:bg-[#7939E3] hover:text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>ابدأ رحلة القراءة الآن</span>
            </Link>

            {/* Solve Quiz Button */}
            <button
              type="button"
              onClick={() => alert("سيتم إتاحة الاختبار قريباً!")}
              className="py-3.5 px-6 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حل الاختبار</span>
            </button>

            {/* Download PDF Button */}
            {story.pdf_url ? (
              <a
                href={story.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="py-3.5 px-6 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل PDF</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => alert("ملف PDF غير متوفر حالياً لهذه القصة")}
                className="py-3.5 px-6 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Left Side Cover Image */}
        <div className="w-full lg:w-95 xl:w-105 aspect-4/3 sm:aspect-square relative rounded-[28px] overflow-hidden shadow-xl border border-slate-100 shrink-0">
          <Image
            src={coverImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </div>
  );
};
