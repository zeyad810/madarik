"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface StoryHeroBannerProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const StoryHeroBanner: React.FC<StoryHeroBannerProps> = ({
  title = "القصص المتاحة",
  subtitle = "تصفّح القصص المتاحة حسب فئتك العمرية وباقاتك",
  className = "",
}) => {
  return (
    <div
      dir="rtl"
      className={`relative w-full aspect-[375/320] max-h-[390px] sm:aspect-auto sm:h-[260px] md:h-[300px] lg:h-[340px] overflow-hidden flex items-center justify-center bg-[#6d28d9] ${className}`}
    >
      {/* 1. Desktop Banner Image (Hidden on Mobile) */}
      <Image
        src="/iamges/Story-Page-Title-Section.png"
        alt="القصص المتاحة"
        fill
        priority
        sizes="(min-width: 640px) 100vw, 1px"
        className="hidden sm:block object-cover sm:object-fill object-center select-none pointer-events-none"
      />

      {/* 2. Mobile Banner Image (Visible on Mobile only - anchored to bottom to prevent bottom crop) */}
      <Image
        src="/iamges/Page-story-mob.png"
        alt="القصص المتاحة"
        fill
        priority
        sizes="(max-width: 640px) 100vw, 1px"
        className="block sm:hidden object-cover object-bottom select-none pointer-events-none"
      />

      {/* Overlay Content: Positioned at top on mobile (above the character illustration), centered on desktop */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 sm:pt-14 md:justify-center md:pt-0 text-center px-4 sm:px-6 z-10">
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

export default StoryHeroBanner;
