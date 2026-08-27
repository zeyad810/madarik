"use client";

import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { ReviewItem, CustomerReviewsProps } from "../types";

// ==========================================
// Render Helper
// ==========================================
const renderReviewCard = (review: ReviewItem) => (
  <motion.div
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="w-full bg-linear-to-b from-white via-[#f7f5ff] to-[#ede9fe] rounded-3xl p-6 md:p-8 flex flex-col items-start text-start shadow-[0_15px_35px_rgba(109,40,217,0.06)] h-full justify-between transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(109,40,217,0.12)]"
  >
    <div className="w-full flex justify-start mb-2">
      <div className="w-10 h-10 rounded-full bg-[#eee8fd] flex items-center justify-center text-mad-main-light font-bold shrink-0">
        <svg className="w-4 h-4 fill-mad-main-light" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
    </div>

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

    <p className="mad-body-3 text-mad-text-primary mb-6 font-medium leading-relaxed text-start">
      &quot;{review.comment}&quot;
    </p>

    <div className="mt-auto flex flex-col items-start text-start">
      <h4 className="mad-label-1 text-mad-main-light font-bold mb-0.5">
        {review.author}
      </h4>
    </div>
  </motion.div>
);

// ==========================================
// Main Component
// ==========================================
const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  id: propId,
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  imageSrc,
  imageAlt,
  reviews: propReviews,
}) => {
  const { data: testimonialsData } = usePublicLanding({
    select: (res) => res.data?.testimonials_section,
  });

  const id = propId ?? testimonialsData?.id;
  const title = propTitle ?? testimonialsData?.title ?? "";
  const subtitle = propSubtitle ?? "آراء العملاء";
  const description = propDescription ?? "";

  const reviews: ReviewItem[] =
    propReviews ??
    (testimonialsData?.items?.map((item) => ({
      id: item.id,
      author: item.name,
      role: item.role,
      comment: item.quote,
      rating: 5,
    })) ?? []);

  return (
    <section dir="rtl" id={id} className="w-full section-spacing px-4 md:px-8 bg-white overflow-hidden">
      <div className="container mx-auto flex flex-col items-center">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          description={description}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          align="center"
          className="mb-12 md:mb-16 max-w-3xl mx-auto"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full"
        >
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
            className="w-full pb-12!"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto! flex">
                {renderReviewCard(review)}
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;
