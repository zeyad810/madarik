"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReviewItem, CustomerReviewsProps } from "../types";


// ==========================================
// 2. Mock Data
// ==========================================
const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    author: "أ. سارة القحطاني",
    role: "ولي أمر",
    comment:
      "المنصة آمنة وموثوقة، التتبع اليومي للمستوى يمنحني رؤية واضحة لتقدم ابني. شكراً على هذا العمل الرائع!",
    rating: 5,
  },
  {
    id: 2,
    author: "أ. سارة القحطاني",
    role: "ولي أمر",
    comment:
      "المنصة آمنة وموثوقة، التتبع اليومي للمستوى يمنحني رؤية واضحة لتقدم ابني. شكراً على هذا العمل الرائع!",
    rating: 5,
  },
  {
    id: 3,
    author: "أ. سارة القحطاني",
    role: "ولي أمر",
    comment:
      "المنصة آمنة وموثوقة، التتبع اليومي للمستوى يمنحني رؤية واضحة لتقدم ابني. شكراً على هذا العمل الرائع!",
    rating: 5,
  },
  {
    id: 4,
    author: "أ. سارة القحطاني",
    role: "ولي أمر",
    comment:
      "المنصة آمنة وموثوقة، التتبع اليومي للمستوى يمنحني رؤية واضحة لتقدم ابني. شكراً على هذا العمل الرائع!",
    rating: 5,
  },
];

// ==========================================
// 3. Render Helper
// ==========================================
const renderReviewCard = (review: ReviewItem) => (
  <div className="w-full bg-linear-to-b from-white via-[#f7f5ff] to-[#ede9fe] rounded-3xl p-6 md:p-8 flex flex-col items-start text-start shadow-[0_15px_35px_rgba(109,40,217,0.06)] h-full justify-between transition-all duration-300 hover:shadow-[0_20px_45px_rgba(109,40,217,0.12)] hover:-translate-y-1">
    {/* أيقونة الاقتباس - أعلى اليمين */}
    <div className="w-full flex justify-start mb-2">
      <div className="w-10 h-10 rounded-full bg-[#eee8fd] flex items-center justify-center text-mad-main-light font-bold shrink-0">
        <svg className="w-4 h-4 fill-mad-main-light" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
    </div>

    {/* نجوم التقييم */}
    <div className="flex items-center justify-start gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 md:w-5 md:h-5 ${
            index < review.rating ? "text-mad-third fill-mad-third" : "text-gray-200"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>

    {/* نص التقييم */}
    <p className="mad-body-3 text-mad-text-primary mb-6 font-medium leading-relaxed text-start">
      &quot;{review.comment}&quot;
    </p>

    {/* اسم كاتب التقييم والدور */}
    <div className="mt-auto flex flex-col items-start text-start">
      <h4 className="mad-label-1 text-mad-main-light font-bold mb-0.5">
        {review.author}
      </h4>
      <span className="mad-label-3 text-mad-text-secondary font-medium">
        {review.role}
      </span>
    </div>
  </div>
);

// ==========================================
// 4. Main Component
// ==========================================
const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  title = "ماذا يقول أولياء الأمور؟",
  subtitle = "آراء العملاء",
  description = "تجارب حقيقية من آباء وأمهات شهدوا تحسناً ملحوظاً في مهارات القراءة والتفكير النقدي لأطفالهم.",
  reviews = DEFAULT_REVIEWS,
}) => {
  return (
    <section dir="rtl" className="w-full section-spacing px-4 md:px-8 bg-white overflow-hidden">
      <div className="container mx-auto flex flex-col items-center">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          description={description}
          align="center"
          className="mb-12 md:mb-16 max-w-3xl mx-auto"
        />
        <Swiper
        modules={[Autoplay]}
        dir="rtl"
        spaceBetween={12}
        slidesPerView={1.2}
        watchOverflow
        observer
        observeParents
        breakpoints={{
          600: {
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          800: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        className="w-full !pb-12"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="h-auto! flex">
            {renderReviewCard(review)}
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
