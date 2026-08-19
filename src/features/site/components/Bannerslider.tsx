"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { BannerSliderProps, BannerSlideItem } from "../types";

const DEFAULT_SLIDES: BannerSlideItem[] = [
  {
    id: 1,
    title: "خطوة جديدة نحو تعلّم أفضل لطفلك",
    titleColor: "text-mad-third",
    description: "قصص ممتعة، تعلّم تفاعلي، ونتائج تساعدك على متابعة تطور طفلك.",
    bgImage: "/assets/Hero_bg.png",
    sideImage: "/assets/hero_image.png",
    sideImageAlt: "أطفال يقرأون القصص",
    buttonText: "إشترك الآن",
    buttonLink: "/register",
  },
  {
    id: 2,
    title: "مكتبة القصص التفاعلية المصورة",
    titleColor: "text-mad-third",
    description: "استمتع بقراءة تشكيلة واسعة من القصص الهادفة والمصممة لتناسب مختلف الفئات العمرية.",
    bgImage: "/iamges/header_background.png",
    sideImage: "/assets/sea_story.png",
    sideImageAlt: "مكتبة القصص",
    buttonText: "تصفّح القصص",
    buttonLink: "/stories",
  },
  {
    id: 3,
    title: "تقارير وأدوات متابعة الأداء للأولياء",
    titleColor: "text-mad-third",
    description: "تابع تطور طفلك وقدراته الاستيعابية أولاً بأول من خلال تقارير تفاعلية ودقيقة.",
    bgImage: "/assets/win-bg.png",
    sideImage: "/iamges/reportSecimg.png",
    sideImageAlt: "تقارير الأداء",
    buttonText: "لوحة المتابعة",
    buttonLink: "/parents",
  },
];

const Bannerslider: React.FC<BannerSliderProps> = ({
  slides = DEFAULT_SLIDES,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = true,
  className = "",
  heightClass = "h-[500px]",
  onSlideChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div dir="rtl" className={`container w-full px-4 py-6 md:py-8 ${className}`}>
      <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-r from-mad-purple-800 via-mad-main to-mad-purple-950 shadow-xl group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={slides.length > 1}
          autoplay={
            autoplayDelay
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          pagination={
            showPagination && slides.length > 1
              ? {
                  clickable: true,
                  el: ".custom-banner-pagination",
                  bulletActiveClass: "swiper-pagination-bullet-active !w-7 !bg-mad-third",
                }
              : false
          }
          navigation={
            showNavigation && slides.length > 1
              ? {
                  nextEl: ".custom-banner-next",
                  prevEl: ".custom-banner-prev",
                }
              : false
          }
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
            onSlideChange?.(swiper.realIndex);
          }}
          dir="rtl"
          className={`w-full ${heightClass}`}
        >
          {slides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <SwiperSlide key={slide.id} className="relative w-full h-full flex items-center">
                {/* Background Image / Overlay */}
                {slide.bgImage && (
                  <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                    <Image
                      src={slide.bgImage}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="object-cover object-center w-full h-full opacity-35"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-mad-purple-900/90 via-mad-main/85 to-mad-purple-950/90 z-10" />
                  </div>
                )}

                {/* Decorative background curves */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                </div>

                {/* Main Slide Grid Layer (Text Right, Image Left in RTL) */}
                <div className="relative z-20 container mx-auto px-6 sm:px-10 lg:px-14 py-8 md:py-10 w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                  {/* Right Side in RTL: Text & CTA Button */}
                  <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col items-center md:items-start text-center md:text-right z-20">
                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 15 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`mad-h2 font-black pb-6 ${
                        slide.titleColor || "text-mad-third"
                      } leading-tight drop-shadow-sm tracking-tight`}
                    >
                      {slide.title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mad-h5 font-medium text-white/90 leading-relaxed max-w-xl pb-10"
                    >
                      {slide.description}
                    </motion.p>

                    {/* Button */}
                    {(slide.buttonText || slide.buttonLink || slide.onButtonClick) && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="pt-2"
                      >
                        {slide.buttonLink ? (
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center justify-center gap-2.5 px-6 py-2 sm:py-2.5 rounded-full border border-white/70 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm sm:text-base backdrop-blur-xs transition-all duration-200 shadow-sm"
                          >
                            <span>{slide.buttonText || "إشترك الآن"}</span>
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={slide.onButtonClick}
                            className="inline-flex items-center justify-center gap-2.5 px-6 py-2 sm:py-2.5 rounded-full border border-white/70 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm sm:text-base backdrop-blur-xs transition-all duration-200 shadow-sm cursor-pointer"
                          >
                            <span>{slide.buttonText || "إشترك الآن"}</span>
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Left Side in RTL: Illustration / Image */}
                  {slide.sideImage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: 30 }}
                      animate={
                        isActive
                          ? { opacity: 1, scale: 1, x: 0 }
                          : { opacity: 0, scale: 0.9, x: 30 }
                      }
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="w-full md:w-5/12 lg:w-1/2 flex justify-center md:justify-end items-center shrink-0"
                    >
                      <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] h-60 sm:h-72 md:h-84 lg:h-96 drop-shadow-2xl">
                        <Image
                          src={slide.sideImage}
                          alt={slide.sideImageAlt || slide.title}
                          fill
                          className="object-contain"
                          priority={index === 0}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Arrows */}
        {showNavigation && slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous Slide"
              className="custom-banner-prev absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              type="button"
              aria-label="Next Slide"
              className="custom-banner-next absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Custom Pagination Bullets */}
        {showPagination && slides.length > 1 && (
          <div className="custom-banner-pagination absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-2 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination-bullet]:cursor-pointer [&_.swiper-pagination-bullet-active]:!w-7 [&_.swiper-pagination-bullet-active]:!bg-mad-third" />
        )}
      </div>
    </div>
  );
};

export default Bannerslider;