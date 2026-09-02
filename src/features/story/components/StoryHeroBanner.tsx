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
      className={`relative w-full overflow-hidden flex items-center justify-center bg-[#7526de] ${className}`}
    >
      {/* Intrinsic Responsive Banner Image (1920x320) */}
      <Image
        src="/iamges/Story-Page-Title-Section.png"
        alt="القصص المتاحة"
        width={1920}
        height={320}
        priority
        style={{ width: "100%", height: "auto" }}
        className="w-full h-auto block select-none pointer-events-none min-h-40 object-cover sm:object-fill"
      />

      {/* Overlay Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
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
          className="text-xs sm:text-sm md:text-base lg:text-lg text-purple-100/95 font-medium max-w-xl mx-auto drop-shadow-sm"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default StoryHeroBanner;
