"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  Loader2,
  ArrowLeft,
  Sparkles,
  Layers,
  Users,
} from "lucide-react";
import { useStorySearch } from "@/features/story/hooks/useStorySearch";
import {
  Story,
  getStoryLevelName,
  getSafeImageUrl,
  DEFAULT_BROKEN_IMAGE,
} from "@/features/story/types";

interface HeaderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderSearchModal: React.FC<HeaderSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    stories,
    debouncedQuery,
    isLoading,
    isFetching,
    hasResults,
  } = useStorySearch(query, { debounceMs: 250, enabled: isOpen });

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleStoryClick = (storyId: string) => {
    onClose();
    router.push(`/stories/${storyId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/stories?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        dir="rtl"
        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-label="البحث عن القصص"
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden mt-8 sm:mt-12 flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white shrink-0"
          >
            <div className="flex items-center justify-center size-10 rounded-2xl bg-purple-50 text-mad-main shrink-0">
              {isLoading || isFetching ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Search className="size-5" strokeWidth={2.2} />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بعنوان القصة (مثال: بحار، شجاعة، مغامرة)..."
              className="w-full text-base sm:text-lg font-medium text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="مسح البحث"
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-500 shrink-0 select-none">
              <span>Esc</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="flex sm:hidden size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </form>

          {/* Results / Suggestions Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-50">
            {/* 1. Loading State */}
            {isLoading && (
              <div className="space-y-3 py-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/80 animate-pulse"
                  >
                    <div className="size-16 rounded-xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Empty State (Searched but no results found) */}
            {!isLoading && debouncedQuery && !hasResults && (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="size-16 rounded-full bg-purple-50 text-mad-main flex items-center justify-center mb-4">
                  <BookOpen className="size-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  لم يتم العثور على قصص تطابق &quot;{debouncedQuery}&quot;
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6">
                  جرّب البحث بكلمات أخرى أو تصفح جميع القصص المتاحة في المكتبة.
                </p>
                <Link
                  href="/stories"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-mad-main text-white font-bold text-sm shadow-md hover:bg-mad-main/90 transition-all active:scale-95"
                >
                  تصفح جميع القصص
                </Link>
              </div>
            )}

            {/* 3. Results Found State */}
            {!isLoading && hasResults && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="text-xs font-bold text-gray-500">
                    {debouncedQuery
                      ? `نتائج البحث عن "${debouncedQuery}" (${stories.length})`
                      : "القصص المتاحة والمقترحة"}
                  </span>
                  {debouncedQuery && (
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-mad-main hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>عرض الكل في صفحة القصص</span>
                      <ArrowLeft className="size-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {stories.map((story) => {
                    const safeImageSrc = getSafeImageUrl(
                      story.cover_photo_url || story.thumbnail_url
                    );

                    const levelName = getStoryLevelName(
                      story.level,
                      "المستوى الأول"
                    );

                    return (
                      <div
                        key={story.id}
                        onClick={() => handleStoryClick(story.id)}
                        className="group flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-purple-200 bg-white hover:bg-purple-50/50 transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        {/* Story Cover */}
                        <div className="relative size-16 sm:size-18 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/60 group-hover:scale-102 transition-transform">
                          <Image
                            src={safeImageSrc}
                            alt={story.title}
                            fill
                            className="object-cover"
                            sizes="72px"
                            unoptimized={safeImageSrc === DEFAULT_BROKEN_IMAGE}
                          />
                        </div>

                        {/* Story Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-bold text-gray-900 group-hover:text-mad-main transition-colors truncate">
                              {story.title}
                            </h4>
                            {story.availability === "free" && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0 border border-emerald-200">
                                مجانية
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {story.age_category &&
                              story.age_category !== "0-0" && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                                  <Users className="size-3 text-gray-400" />
                                  {story.age_category} سنة
                                </span>
                              )}

                            <span className="inline-flex items-center gap-1 bg-purple-50 text-mad-main px-2 py-0.5 rounded-md font-medium">
                              <Layers className="size-3 text-mad-main/70" />
                              {levelName}
                            </span>

                            {story.code && (
                              <span className="text-[11px] text-gray-400 font-mono">
                                {story.code}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Arrow */}
                        <div className="flex items-center justify-center size-8 rounded-full bg-gray-100 text-gray-400 group-hover:bg-mad-main group-hover:text-white transition-colors shrink-0">
                          <ArrowLeft className="size-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Initial helper footer if no search query */}
            {!debouncedQuery && !isLoading && (
              <div className="pt-4 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-500" />
                  اكتب اسم القصة للبحث الفوري
                </span>
                <span>اضغط Enter للبحث الشامل</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HeaderSearchModal;
