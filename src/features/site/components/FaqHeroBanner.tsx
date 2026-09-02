"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FaqHeroBannerProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FaqHeroBanner: React.FC<FaqHeroBannerProps> = ({
  title = "الأسئلة الشائعة",
  subtitle = "كل ما تحتاج معرفته عن المنصة، الاشتراك، وطريقة استخدام خدماتنا.",
  className = "",
}) => {
  return (
    <div
      dir="rtl"
      className={`relative w-full h-[320px] sm:h-[280px] md:h-[320px] lg:h-[360px] overflow-hidden flex items-center justify-center bg-[#7526de] ${className}`}
    >
      {/* 1. Desktop Banner Image (Hidden on Mobile) */}
      <Image
        src="/iamges/faq-page-banner.png"
        alt="الأسئلة الشائعة"
        fill
        priority
        sizes="100vw"
        className="hidden sm:block object-cover sm:object-fill object-center select-none pointer-events-none"
      />

      {/* 2. Mobile Banner Image (Visible on Mobile only) */}
      <Image
        src="/iamges/faq-page-banner-mob.png"
        alt="الأسئلة الشائعة"
        fill
        priority
        sizes="100vw"
        className="block sm:hidden object-cover object-center select-none pointer-events-none"
      />

      {/* Overlay Content: Positioned at top on mobile (above the 3D graphics), centered on desktop */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 sm:pt-14 md:justify-center md:pt-0 text-center px-4 sm:px-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1.5 sm:mb-2 md:mb-3 tracking-tight drop-shadow-md"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-purple-100/95 font-medium max-w-70 xs:max-w-xs sm:max-w-md md:max-w-xl mx-auto drop-shadow-sm leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default FaqHeroBanner;
