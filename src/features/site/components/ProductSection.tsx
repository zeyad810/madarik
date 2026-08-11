"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { SectionHeader } from "@/components/ui/SectionHeader";
import ProductCard from "@/features/products/ProductCard";
import { Product } from "@/features/products/types";
import { ProductSectionProps } from "../types";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "sea-story-01",
    title: "البحر الأزرق الغامض",
    description:
      "رحلة تفاعلية مع كائنات المحيط الملونة لكشف أسرار الشعاب المرجانية وتنمية الوعي البيئي بالبحار.",
    imageSrc: "/assets/sea_story.png",
    imageAlt: "البحر الأزرق الغامض",
    ageRange: "۱۰ - ۱۲ سنة",
    isFree: true,
    levelTag: "متقدم",
    storyCodeTag: "Story 000-XXX",
    ctaText: "ابدأ القراءة",
  },
  {
    id: "jungle-story-02",
    title: "مغامرة في الغابة السحرية",
    description:
      "استكشف أسرار الكائنات والحيوانات في أعماق الغابة واكتسب مفردات جديدة بمتعة تشويقية.",
    imageSrc: "/assets/sea_story.png",
    imageAlt: "مغامرة في الغابة السحرية",
    ageRange: "٥ - ٨ سنوات",
    isFree: true,
    levelTag: "مبتدئ",
    storyCodeTag: "Story 001-ABC",
    ctaText: "ابدأ القراءة",
  },
  {
    id: "space-story-03",
    title: "رحلة إلى الفضاء الخارجي",
    description:
      "انطلق في رحلة بين الكواكب والنجوم لتعرف أكثر عن العجائب الكونيه والمهارات العلمية.",
    imageSrc: "/assets/sea_story.png",
    imageAlt: "رحلة إلى الفضاء الخارجي",
    ageRange: "٨ - ۱۰ سنوات",
    isFree: true,
    levelTag: "متوسط",
    storyCodeTag: "Story 002-XYZ",
    ctaText: "ابدأ القراءة",
  },
  {
    id: "castle-story-04",
    title: "سر القلعة الذهبية",
    description:
      "مغامرة مشوقة لحل الألغاز وبناء القيم الأخلاقية والتفكير النقدي بطريقة تفاعلية.",
    imageSrc: "/assets/sea_story.png",
    imageAlt: "سر القلعة الذهبية",
    ageRange: "۱۰ - ۱۲ سنة",
    isFree: true,
    levelTag: "متقدم",
    storyCodeTag: "Story 003-LMN",
    ctaText: "ابدأ القراءة",
  },
  {
    id: "insects-story-05",
    title: "عالم الحشرات العجيب",
    description:
      "اكتشف عالم الطبيعة والكائنات الصغيرة من خلال مشاهد تفاعلية ملونة ومبسطة للأطفال.",
    imageSrc: "/assets/sea_story.png",
    imageAlt: "عالم الحشرات العجيب",
    ageRange: "٥ - ٨ سنوات",
    isFree: true,
    levelTag: "مبتدئ",
    storyCodeTag: "Story 004-DEF",
    ctaText: "ابدأ القراءة",
  },
  {
    id: "heroes-story-06",
    title: "أبطال المستقبل",
    description:
      "قصص ملهمة تعزز الثقة بالنفس والتعاون وبناء المهارات القيادية للأجيال القادمة.",
    imageSrc: "/assets/sea_story.png",
    imageAlt: "أبطال المستقبل",
    ageRange: "٨ - ۱۰ سنوات",
    isFree: true,
    levelTag: "متوسط",
    storyCodeTag: "Story 005-OPQ",
    ctaText: "ابدأ القراءة",
  },
];

const ProductSection: React.FC<ProductSectionProps> = ({
  title = "قصصنا الأكثر شعبية",
  subtitle = "المكتبة التفاعلية",
  description = "مجموعة مختارة من الأنشطة والقصص المصممة خصيصاً لتطوير مهارات القراءة والكتابة بمتعة وأمان.",
  products = DEFAULT_PRODUCTS,
}) => {
  return (
    <section
      dir="rtl"
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
        <Swiper
          modules={[Autoplay, Pagination]}
          dir="rtl"
          spaceBetween={16}
          slidesPerView={1.2}
          // autoplay={{
          //   delay: 4000,
          //   disableOnInteraction: false,
          // }}
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
              <ProductCard product={item} className="max-w-none" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductSection;