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
  <div className="w-full bg-gradient-to-b from-white/50 to-lightmain/10 rounded-[32px] p-6 md:p-8 flex flex-col items-start text-right shadow-sm border border-lightmain/10 h-full justify-between transition-all duration-300">
    <div className="w-11 h-11 bg-lightmain/15 rounded-full flex items-center justify-center text-lightmain font-bold text-xl mb-4 shrink-0">
      <Image
        src="/iamges/CustomerReviews/CustomerReviews..svg"
        alt="quote icon"
        width={20}
        height={20}
        className="object-contain"
      />
    </div>

    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < review.rating;
        return (
          <svg
            key={index}
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
              isFilled
                ? "fill-third text-third"
                : "fill-none stroke-[#C49015] stroke-[1.5]"
            }`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385c.116.488-.42.88-.843.621l-4.69-2.83a.563.563 0 0 0-.582 0l-4.69 2.83c-.423.259-.959-.133-.843-.621l1.285-5.385a.563.563 0 0 0-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        );
      })}
    </div>

    <p className="text-text-primary text-xs md:text-sm leading-relaxed mb-6 font-medium">
      &quot;{review.comment}&quot;
    </p>

    <div className="mt-auto">
      <h4 className="text-primary font-bold text-base md:text-lg mb-0.5">
        {review.author}
      </h4>
      <span className="text-text-secondary text-xs font-normal">
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
    <div dir="rtl" className="w-full max-w-7xl mx-auto">
      <Swiper
        modules={[Autoplay]}
        dir="rtl"
        spaceBetween={12}
        slidesPerView={1.2}
        watchOverflow
        observer
        observeParents
        breakpoints={{
          640: {
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          768: {
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
          <SwiperSlide key={review.id} className="!h-auto flex">
            {renderReviewCard(review)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerReviews;
