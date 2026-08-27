"use client";

import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { SectionHeader } from "@/components/ui/SectionHeader";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/features/products/types";
import { getSafeImageUrl } from "@/features/story/types";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { ProductSectionProps } from "../types";

const ProductSection: React.FC<ProductSectionProps> = ({
  id: propId,
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  products: propProducts,
}) => {
  const { data: storiesData } = usePublicLanding({
    select: (res) => res.data?.suggested_stories_section,
  });

  const id = propId ?? storiesData?.id;
  const title = propTitle ?? storiesData?.title ?? "";
  const subtitle = propSubtitle ?? "المكتبة التفاعلية";
  const description = propDescription ?? "";

  const products: Product[] =
    propProducts ??
    (storiesData?.items?.map((story) => {
      const safeImageSrc = getSafeImageUrl(
        story.cover_photo_url || story.thumbnail_url
      );

      return {
        id: story.id,
        title: story.title,
        description:
          story.description ??
          story.blocks?.find((b) => b.block_type === "text")?.content ??
          "",
        imageSrc: safeImageSrc,
        imageAlt: story.title,
        ageRange:
          story.age_category && story.age_category !== "0-0"
            ? `${story.age_category} سنة`
            : "جميع الأعمار",
        isFree: story.availability === "free",
        availability: story.availability,
        levelTag: story.level,
        storyCodeTag: story.code,
        ctaText: "ابدأ القراءة",
        ctaLink: `/stories/${story.id}`,
      };
    }) ?? []);

  return (
    <section
      dir="rtl"
      id={id}
      className="w-full section-spacing px-4 md:px-8 bg-white overflow-hidden"
    >
      <div className="container mx-auto flex flex-col items-center">
        {/* Section Header */}
        <SectionHeader
          title={title}
          subtitle={subtitle}
          description={description}
          align="center"
          className="mb-12 md:mb-16 max-w-3xl mx-auto"
        />

        {/* Product Swiper Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            dir="rtl"
            spaceBetween={16}
            slidesPerView={1.2}
            watchOverflow
            observer
            observeParents
            breakpoints={{
              375: {
                slidesPerView: 1.2,
                spaceBetween: 12,
              },
              600: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1360: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="w-full pb-14!"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id} className="h-auto! flex justify-center">
                <ProductCard product={item} className="max-w-none h-full" />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;