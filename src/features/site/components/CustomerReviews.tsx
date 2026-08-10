"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

// ==========================================
// 1. TypeScript Types
// ==========================================
export interface ReviewItem {
  id: string | number;
  author: string;
  role: string;
  comment: string;
  rating: number;
}

interface CustomerReviewsProps {
  reviews?: ReviewItem[];
}

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
    rating: 0,
  },
  {
    id: 2,
    author: "أ. سارة القحطاني",
    role: "ولي أمر",
    comment:
      "المنصة آمنة وموثوقة، التتبع اليومي للمستوى يمنحني رؤية واضحة لتقدم ابني. شكراً على هذا العمل الرائع!",
    rating: 0,
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
  <div className="w-full bg-(--mad-purple-50) rounded-4xl p-6 md:p-8 flex flex-col items-start text-right shadow-[0_10px_30px_rgba(109,40,217,0.05)] border border-(--mad-purple-100) h-full justify-between transition-all duration-300">
    {/* أيقونة الاقتباس - اتجاه اليمين */}
    <div className="w-11 h-11 bg-(--mad-purple-100) rounded-full flex items-center justify-center text-mad-main-light font-bold text-xl mb-4 shrink-0">
      <svg className="w-5 h-5 fill-mad-main-light" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>

    <div className="flex items-center gap-1 mb-4">
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
    <p className="mad-body-3 text-mad-text-primary mb-6 font-medium">
      &quot;{review.comment}&quot;
    </p>

    <div className="mt-auto">
      <h4 className="mad-label-1 text-mad-main-light font-bold mb-0.5">
        {review.author}
      </h4>
      <span className="mad-label-3 text-mad-text-secondary font-normal">
        {review.role}
      </span>
    </div>
  </div>
);

// ==========================================
// 4. Main Component
// ==========================================
const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews = DEFAULT_REVIEWS,
}) => {
  return (
    <section dir="rtl" className="w-full container mx-auto section-spacing px-4 md:px-8">
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
    </section>
  );
};

export default CustomerReviews;
