"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/features/products/types";
import {
  StoryHeroBanner,
  StoryFilters,
  StoryEmptyState,
  StoryFilterType,
} from "@/features/story";
import { useFreeStories } from "@/features/story/hooks/useFreeStories";
import { Loader2 } from "lucide-react";

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_STEP = 4;

export default function StoriesPage() {
  const { data: storiesResponse, isLoading, isError } = useFreeStories();
  const allStories = storiesResponse?.data ?? [];

  // Filter States
  const [activeTab, setActiveTab] = useState<StoryFilterType>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  // Extract unique age categories & levels dynamically from API data
  const availableAges = useMemo(() => {
    const set = new Set<string>();
    allStories.forEach((s) => {
      if (s.age_category && s.age_category !== "0-0") {
        set.add(`${s.age_category} سنة`);
      }
    });
    return Array.from(set);
  }, [allStories]);

  const availableLevels = useMemo(() => {
    const set = new Set<string>();
    allStories.forEach((s) => {
      if (s.level) {
        set.add(s.level);
      }
    });
    return Array.from(set);
  }, [allStories]);

  // Handle Tab Switch
  const handleTabChange = (tab: StoryFilterType) => {
    setActiveTab(tab);
    setSelectedAge("all");
    setSelectedLevel("all");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Filtered stories based on selection
  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      if (activeTab === "age" && selectedAge !== "all") {
        const storyAge = `${story.age_category} سنة`;
        return storyAge === selectedAge;
      }
      if (activeTab === "level" && selectedLevel !== "all") {
        return story.level === selectedLevel;
      }
      return true;
    });
  }, [allStories, activeTab, selectedAge, selectedLevel]);

  // Visible stories for pagination
  const visibleStories = useMemo(() => {
    return filteredStories.slice(0, visibleCount);
  }, [filteredStories, visibleCount]);

  const hasMore = visibleCount < filteredStories.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSelectedAge("all");
    setSelectedLevel("all");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Map Story to ProductCard format
  const mappedProducts: Product[] = visibleStories.map((story) => {
    const rawImg = story.cover_photo_url || story.thumbnail_url;
    const isBrokenPlaceholder =
      !rawImg || rawImg.includes("via.placeholder.com");
    const safeImageSrc = isBrokenPlaceholder
      ? "/assets/sea_story.png"
      : rawImg;

    return {
      id: story.id,
      title: story.title,
      description:
        story.description ??
        story.blocks?.find((b) => b.block_type === "text")?.content ??
        "رحلة تفاعلية مع كائنات المحيط الملونة لكشف أسرار الشعب المرجانية وتنمية الوعي البيئي بالبحار.",
      imageSrc: safeImageSrc,
      imageAlt: story.title,
      ageRange:
        story.age_category && story.age_category !== "0-0"
          ? `${story.age_category} سنة`
          : "جميع الأعمار",
      isFree: story.availability === "free" || !story.availability,
      levelTag: story.level ?? "متقدم",
      storyCodeTag: story.code ?? "Story 000-XXX",
      ctaText: "ابدأ القراءة",
      ctaLink: `/stories/${story.id}`,
    };
  });

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50">
      {/* 1. Top Purple Hero Banner */}
      <StoryHeroBanner />

      {/* 2. Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 flex-1 flex flex-col items-center">
        {/* Filter Tabs & Chips */}
        <StoryFilters
          activeTab={activeTab}
          onTabChange={handleTabChange}
          availableAges={availableAges}
          selectedAge={selectedAge}
          onAgeChange={setSelectedAge}
          availableLevels={availableLevels}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#7939E3]" />
            <p className="font-bold text-sm">جاري تحميل القصص المتاحة...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (filteredStories.length === 0 || isError) && (
          <StoryEmptyState
            title="لا توجد قصص متاحة"
            buttonText="العودة للرئيسية"
            buttonHref="/"
            onResetFilters={
              activeTab !== "all" || selectedAge !== "all" || selectedLevel !== "all"
                ? handleResetFilters
                : undefined
            }
          />
        )}

        {/* Stories Grid */}
        {!isLoading && filteredStories.length > 0 && (
          <>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center mb-12">
              {mappedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: (idx % 4) * 0.08 }}
                  className="w-full flex justify-center"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button ("عرض المزيد") */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center my-6"
              >
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-10 py-3.5 rounded-full border-2 border-[#7939E3] text-[#7939E3] font-bold text-base hover:bg-[#7939E3] hover:text-white transition-all duration-200 shadow-xs active:scale-95 cursor-pointer select-none"
                >
                  عرض المزيد
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
