"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/features/products/types";
import { Story, getStoryLevelName } from "../types";

interface StoryGridProps {
  stories: Story[];
  visibleCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const StoryGrid: React.FC<StoryGridProps> = ({
  stories,
  visibleCount,
  hasMore = false,
  onLoadMore,
}) => {
  // Slice stories if visibleCount is passed
  const displayedStories = useMemo(() => {
    if (typeof visibleCount === "number") {
      return stories.slice(0, visibleCount);
    }
    return stories;
  }, [stories, visibleCount]);

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
      {hasMore && onLoadMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
    </>
  );
};

export default StoryGrid;
