"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ListFilter,
  FileText,
} from "lucide-react";
import {
  usePublicTerms,
  usePublicPrivacy,
  DEFAULT_TERMS_DATA,
  DEFAULT_PRIVACY_DATA,
} from "../hooks/useLegalData";
import { LegalItem, LegalPageProps } from "../types";

// Convert numbers to Arabic-Indic digits (١, ٢, ٣...)
const toArabicNumerals = (n: number): string => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return n
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join("");
};

// Normalize clean title without duplicated numbering
const cleanTitle = (rawTitle: string, index: number): string => {
  const trimmed = rawTitle.trim();
  const stripped = trimmed.replace(/^[\d٠-٩]+[\.\-\s\)]+/, "");
  return `${toArabicNumerals(index + 1)}. ${stripped.length > 0 ? stripped : trimmed}`;
};

export const LegalPageView: React.FC<LegalPageProps> = ({
  type,
  customTitle,
  customSubtitle,
}) => {
  const isTerms = type === "terms";

  // Data fetching based on page type
  const termsQuery = usePublicTerms({ enabled: isTerms });
  const privacyQuery = usePublicPrivacy({ enabled: !isTerms });

  const query = isTerms ? termsQuery : privacyQuery;
  const { data, isLoading, isError, error, refetch } = query;

  const fallbackItems = isTerms ? DEFAULT_TERMS_DATA : DEFAULT_PRIVACY_DATA;
  const rawItems = (data?.data && data.data.length > 0 ? data.data : fallbackItems) as LegalItem[];
  // Sort items by display_order ascending
  const items = React.useMemo(() => {
    return [...rawItems].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
  }, [rawItems]);


  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set default active section
  useEffect(() => {
    if (items.length > 0 && !activeSectionId) {
      setActiveSectionId(items[0].id);
    }
  }, [items, activeSectionId]);

  // Scroll spy setup
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        const topEntry = visibleEntries.reduce((prev, curr) =>
          prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
        );
        setActiveSectionId(topEntry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-90px 0px -60% 0px",
      threshold: [0, 0.2, 0.5],
    });

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Titles & Subtitles
  const pageTitle =
    customTitle ??
    (isTerms
      ? "الشروط والأحكام واتفاقية الاستخدام"
      : "سياسة الخصوصية وحماية البيانات");

  const pageSubtitle =
    customSubtitle ??
    (isTerms
      ? "شروط الخدمة والالتزامات المتبادلة لضمان رحلة استخدام آمنة ومريحة لكافة الأسر والمؤسسات التعليمية الشريكة."
      : "بنود سياسة الخصوصية وحماية البيانات الشخصية والالتزامات المتبادلة لضمان بيئة آمنة لأطفالك.");

  const tocTitle = isTerms ? "أقسام الاتفاقية" : "أقسام سياسة الخصوصية";

  // Content formatter helper
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const rawBlocks = content.split(/\n\n+/);

    return rawBlocks.map((block, bIdx) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return null;

      // Check if block is an alert / notice box
      const isAlert =
        trimmedBlock.startsWith("تنبيه") ||
        trimmedBlock.startsWith("تنويه") ||
        trimmedBlock.startsWith("ملاحظة") ||
        trimmedBlock.includes("تنبيه للمستخدم:") ||
        trimmedBlock.includes("تنويه هام:");

      if (isAlert) {
        return (
          <div
            key={bIdx}
            className="my-4 px-5 py-3.5 rounded-l-xl bg-[#F5F2FD] border-r-4 border-[#7F48EF] text-[#6D28D9] text-sm sm:text-base leading-relaxed font-medium"
          >
            {trimmedBlock}
          </div>
        );
      }

      // Check if block contains bullet items
      const lines = trimmedBlock.split("\n");
      const hasBullets = lines.some((l) => /^\s*[•\-\*]\s+/.test(l));

      if (hasBullets) {
        const introLines: string[] = [];
        const bulletLines: string[] = [];

        let inBulletSection = false;
        lines.forEach((line) => {
          const isBullet = /^\s*[•\-\*]\s+/.test(line);
          if (isBullet) {
            inBulletSection = true;
            bulletLines.push(line.replace(/^\s*[•\-\*]\s+/, ""));
          } else if (!inBulletSection) {
            introLines.push(line);
          } else {
            bulletLines.push(line.trim());
          }
        });

        return (
          <div key={bIdx} className="mb-4 space-y-2.5">
            {introLines.length > 0 && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {introLines.join("\n")}
              </p>
            )}
            <ul className="space-y-2 pr-2">
              {bulletLines.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-slate-600 text-sm sm:text-base leading-relaxed"
                >
                  <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Standard paragraph
      return (
        <p
          key={bIdx}
          className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 font-normal whitespace-pre-line"
        >
          {trimmedBlock}
        </p>
      );
    });
  };

  return (
    <div dir="rtl" className="w-full bg-[#FAFAFD] min-h-screen flex flex-col font-sans">
      {/* ========================================================
          1. HERO BANNER
         ======================================================== */}
      <section className="relative w-full bg-[#6D28D9] text-white pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center"
          >
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight tracking-normal">
              {pageTitle}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-normal">
              {pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          2. MAIN CONTENT AREA (TOC + DOCUMENT)
         ======================================================== */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Main Card Skeleton (Right in RTL) */}
            <div className="lg:col-span-9 bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-slate-100 animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-4 bg-slate-100 rounded-md w-full" />
                  <div className="h-4 bg-slate-100 rounded-md w-4/5" />
                </div>
              ))}
            </div>

            {/* Sidebar Skeleton (Left in RTL) */}
            <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 shadow-xs border border-slate-100 animate-pulse">
              <div className="h-5 bg-slate-200 rounded-md w-1/2 mx-auto mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 bg-slate-100 rounded-md w-full" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-red-100 text-center">
            <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              تعذر تحميل محتوى الصفحة
            </h2>
            <p className="text-slate-500 text-sm mb-5">
              {error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء جلب البيانات."}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6D28D9] text-white hover:bg-[#5B20B5] transition-colors text-sm font-semibold cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && items.length === 0 && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
            <div className="size-12 rounded-full bg-purple-50 text-[#6D28D9] flex items-center justify-center mx-auto mb-3">
              <FileText className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              لا توجد بنود متاحة حالياً
            </h2>
            <p className="text-slate-400 text-sm">
              يتم تحديث بنود الوثيقة حالياً من قبل الإدارة وسوف تظهر هنا قريباً.
            </p>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Mobile Sticky Quick Dropdown / TOC Bar */}
            <div className="lg:hidden w-full sticky top-18 z-30 mb-3">
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between text-right px-2 py-1 text-sm font-bold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2 truncate">
                    <ListFilter className="size-4 text-[#6D28D9]" />
                    <span className="truncate">
                      {items.find((i) => i.id === activeSectionId)?.title || tocTitle}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 text-slate-500 transition-transform duration-200 ${
                      mobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Mobile Drawer Dropdown */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-1.5 bg-white rounded-xl p-2.5 shadow-lg border border-slate-100 max-h-60 overflow-y-auto space-y-1"
                  >
                    {items.map((item, index) => {
                      const isActive = activeSectionId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-right px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                            isActive
                              ? "text-[#6D28D9] font-bold bg-purple-50"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {cleanTitle(item.title, index)}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ========================================================
                1. MAIN DOCUMENT CARD (Right in RTL layout)
               ======================================================== */}
            <main className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100/80">
              <div className="space-y-8 sm:space-y-10">
                {items.map((item, index) => {
                  const sectionHeading = cleanTitle(item.title, index);

                  return (
                    <article
                      key={item.id}
                      id={item.id}
                      className="scroll-mt-28"
                    >
                      {/* Section Title */}
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-850 mb-3">
                        {sectionHeading}
                      </h2>

                      {/* Section Content */}
                      <div>
                        {renderFormattedContent(item.content)}
                      </div>
                    </article>
                  );
                })}
              </div>
            </main>

            {/* ========================================================
                2. SIDEBAR (Desktop Table of Contents - Left in RTL layout)
               ======================================================== */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 text-center mb-3.5 pb-2.5 border-b border-slate-100">
                  {tocTitle}
                </h2>

                <nav className="space-y-1.5" aria-label={tocTitle}>
                  {items.map((item, index) => {
                    const isActive = activeSectionId === item.id;
                    const formattedTitle = cleanTitle(item.title, index);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-right block px-3 py-2 rounded-lg text-sm sm:text-[15px] leading-relaxed transition-all duration-150 cursor-pointer ${
                          isActive
                            ? "text-[#6D28D9] font-bold"
                            : "text-slate-400 hover:text-slate-600 font-medium"
                        }`}
                      >
                        <span className="line-clamp-2">{formattedTitle}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        )}

      </section>
    </div>
  );
};

export default LegalPageView;


