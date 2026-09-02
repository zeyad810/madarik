"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import { BannerSliderProps, BannerSlideItem } from "../types";
import { usePublicLanding } from "../hooks/usePublicLanding";

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
    buttonLink: "/packages",
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
    buttonText: "إشترك الآن",
    buttonLink: "/register",
  },
];

const Bannerslider: React.FC<BannerSliderProps> = ({
  id: propId,
  slides: propSlides,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = true,
  className = "",
  heightClass = "h-[500px]",
  onSlideChange,
}) => {
  const { data: bannerSection } = usePublicLanding({
    select: (res) => res.data?.banners_section,
  });

  const id = propId ?? bannerSection?.id ?? "banners_section";

  const rawItems = bannerSection?.items;
  const validItems = rawItems && rawItems.length > 0
    ? rawItems
        .filter((item) => !item.status || item.status === "active")
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    : [];

  const slides: BannerSlideItem[] =
    propSlides ??
    (validItems.length > 0
      ? validItems.map((item, idx) => {
          const isStoryBanner = item.title?.includes("قصص") || item.description?.includes("قصص");
          const defaultLink = isStoryBanner ? "/stories" : "/register";
          const defaultText = isStoryBanner ? "تصفّح القصص" : "إشترك الآن";

          return {
            id: item.id || idx,
            title: item.title,
            description: item.description,
            bgImage: item.image_url,
            sideImage: item.side_image_url,
            sideImageAlt: item.title,
            buttonLink: item.link_url || defaultLink,
            buttonText:
              (item as unknown as { button_text?: string; cta_text?: string })
                .button_text ||
              (item as unknown as { button_text?: string; cta_text?: string })
                .cta_text ||
              defaultText,
          };
        })
      : DEFAULT_SLIDES);

  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div id={id} dir="rtl" className={`container relative w-full px-4 py-6 md:py-8 ${className}`}>
      {/* Anchor targets for #banners and #banner-slider */}
      <span id="banners" className="sr-only absolute -top-24 pointer-events-none" />
      <span id="banner-slider" className="sr-only absolute -top-24 pointer-events-none" />

      <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-r from-mad-purple-800 via-mad-main to-mad-purple-950 shadow-xl group">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          loop={slides.length > 1}
          loopPreventsSliding={false}
          watchSlidesProgress={true}
          allowTouchMove={true}
          autoplay={
            autoplayDelay
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          onSwiper={setSwiper}
          onRealIndexChange={(s) => {
            setActiveIndex(s.realIndex);
            onSlideChange?.(s.realIndex);
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
                      sizes="(min-width: 1600px) 1568px, calc(100vw - 32px)"
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
                  <div
                    className={`w-full ${
                      slide.sideImage ? "md:w-7/12 lg:w-1/2" : "max-w-2xl"
                    } flex flex-col items-center md:items-start text-center md:text-right z-20`}
                  >
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
                    {slide.description ? (
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mad-h5 font-medium text-white/90 leading-relaxed max-w-xl pb-10"
                      >
                        {slide.description}
                      </motion.p>
                    ) : null}

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
                            target={
                              /^https?:\/\//.test(slide.buttonLink)
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              /^https?:\/\//.test(slide.buttonLink)
                                ? "noopener noreferrer"
                                : undefined
                            }
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
                      <div className="relative w-full max-w-85 sm:max-w-105 md:max-w-120 lg:max-w-135 h-60 sm:h-72 md:h-84 lg:h-96 drop-shadow-2xl">
                        <Image
                          src={slide.sideImage}
                          alt={slide.sideImageAlt || slide.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                          className="object-contain"
                          loading={index === 0 ? "eager" : "lazy"}
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
              onClick={handlePrev}
              aria-label="الشريحة السابقة"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-12 rounded-full bg-black/35 hover:bg-black/55 active:scale-90 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer shadow-2xl pointer-events-auto select-none"
            >
              <ChevronRight className="size-6 text-white stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="الشريحة التالية"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-12 rounded-full bg-black/35 hover:bg-black/55 active:scale-90 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer shadow-2xl pointer-events-auto select-none"
            >
              <ChevronLeft className="size-6 text-white stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Custom Pagination Bullets */}
        {showPagination && slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-50 flex items-center justify-center gap-2.5 sm:gap-3 pointer-events-auto">
            {slides.map((_, idx) => {
              const isCurrent = activeIndex === idx;
              return (
                <button
                  key={`banner-bullet-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (swiper) {
                      swiper.slideToLoop(idx);
                    }
                  }}
                  aria-label={`انتقل إلى الشريحة ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? "w-8 sm:w-10 bg-mad-third shadow-[0_0_14px_rgba(255,186,0,0.9)] ring-2 ring-mad-third/40"
                      : "w-2.5 bg-white/40 hover:bg-white/80 hover:scale-125"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bannerslider;