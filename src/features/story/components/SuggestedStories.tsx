"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/features/products/types";
import { Story, getSafeImageUrl } from "../types";

interface SuggestedStoriesProps {
  stories: Story[];
  currentStoryId?: string;
  className?: string;
}

export const SuggestedStories: React.FC<SuggestedStoriesProps> = ({
  stories,
  currentStoryId,
  className = "",
}) => {
  // Sort by newest (created_at descending if available) and filter out current story, take top 10
  const filteredStories = [...stories]
    .filter((s) => s.id !== currentStoryId)
    .sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    })
    .slice(0, 10);

  if (filteredStories.length === 0) return null;

  const products: Product[] = filteredStories.map((story) => {
    const safeImageSrc = getSafeImageUrl(
      story.cover_photo_url || story.thumbnail_url
    );

    return {
      id: story.id,
      title: story.title,
      description:
        story.description ??
        story.blocks?.find((b) => b.block_type === "text")?.content ??
        "قصة تعليمية ممتعة وملهمة للأطفال",
      imageSrc: safeImageSrc,
      imageAlt: story.title,
      availability: story.availability,
      isFree: story.availability === "free" || !story.availability,
      ageRange:
        story.age_category && story.age_category !== "0-0"
          ? `${story.age_category} سنة`
          : "جميع الأعمار",
      levelTag:
        (typeof story.level === "object" && story.level
          ? story.level.name
          : story.level) ?? undefined,
      storyCodeTag: story.code,
      ctaText: "ابدأ القراءة",
      ctaLink: `/stories/${story.id}`,
    };
  });

  return (
    <section dir="rtl" className={`w-full py-12 ${className}`}>
      {/* Section Header with Book & Star illustration */}
      <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto">
        <div className="relative w-16 h-16 mb-4">
          <Image
            src="/iamges/sectionHeading.png"
            alt="أيقونة قصص مقترحة"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-mad-text-primary mb-2">
          قصص مقترحة قد تعجب طفلك
        </h3>

        <p className="text-sm sm:text-base text-mad-text-secondary font-medium leading-relaxed">
          نؤمن بأن بناء شخصية الطفل يبدأ من ترسيخ القيم وتنمية الفضول وتحويل
          المهارات إلى أدوات يعيشها بحب وسعادة وعمق.
        </p>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {products.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="w-full flex justify-center"
          >
            <ProductCard product={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
