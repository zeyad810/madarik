"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/features/products/types";
import { Story, getStoryLevelName } from "../types";

import { StoriesPagination } from "./StoriesPagination";

interface StoryGridProps {
  stories: Story[];
  visibleCount?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const StoryGrid: React.FC<StoryGridProps> = ({
  stories,
  visibleCount,
  showLoadMore = false,
  onLoadMore,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  // Slice stories if visibleCount is passed and pagination is not active
  const displayedStories = useMemo(() => {
    if (typeof visibleCount === "number" && !showPagination) {
      return stories.slice(0, visibleCount);
    }
    return stories;
  }, [stories, visibleCount, showPagination]);

  // Map Story to Product card format
  const mappedProducts: Product[] = useMemo(() => {
    return displayedStories.map((story) => {
      const rawImg = story.cover_photo_url || story.thumbnail_url;
      const isBrokenPlaceholder =
        !rawImg || rawImg.includes("via.placeholder.com");
      const safeImageSrc = isBrokenPlaceholder
        ? "/assets/sea_story.png"
        : rawImg;

      const levelStr = getStoryLevelName(story.level, "المستوى الأول");

      return {
        id: story.id,
        title: story.title,
        description:
          story.description ??
          story.blocks?.find((b) => b.block_type === "text")?.content ??
          "رحلة تفاعلية ممتعة وشيقة لتنمية مهارات القراءة والاستيعاب.",
        imageSrc: safeImageSrc,
        imageAlt: story.title,
        ageRange:
          story.age_category && story.age_category !== "0-0"
            ? `${story.age_category} سنة`
            : "جميع الأعمار",
        isFree: story.availability === "free" || !story.availability,
        availability: story.availability || "free",
        levelTag: levelStr,
        storyCodeTag: story.code ?? "Story 000-XXX",
        ctaText: "ابدأ القراءة",
        ctaLink: `/stories/${story.id}`,
      };
    });
  }, [displayedStories]);

  if (displayedStories.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center mb-8">
        {mappedProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: (idx % 4) * 0.06 }}
            className="w-full flex justify-center"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* 1. "عرض المزيد" Button (Shown once for Page 1 before switching to pagination) */}
      {showLoadMore && !showPagination && onLoadMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center my-6"
        >
          <button
            type="button"
            onClick={onLoadMore}
            className="px-10 py-3.5 rounded-full border-2 border-[#7939E3] text-[#7939E3] font-bold text-base hover:bg-[#7939E3] hover:text-white transition-all duration-200 shadow-xs active:scale-95 cursor-pointer select-none"
          >
            عرض المزيد
          </button>
        </motion.div>
      )}

      {/* 2. Numbered Pagination Bar (Shown after "عرض المزيد" is clicked or when pagination is enabled) */}
      {showPagination && totalPages > 1 && onPageChange && (
        <StoriesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default StoryGrid;
