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
      className={`relative w-full overflow-hidden flex items-center justify-center bg-[#7526de] ${className}`}
    >
      {/* Responsive Intrinsic Banner Image (1920x320) */}
      <Image
        src="/iamges/faq-page-banner.png"
        alt="الأسئلة الشائعة"
        width={1920}
        height={320}
        priority
        className="w-full h-auto block select-none pointer-events-none min-h-[160px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[320px] object-cover sm:object-fill"
      />

      {/* Overlay Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tight drop-shadow-md"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-purple-100/95 font-medium max-w-xl mx-auto drop-shadow-sm leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default FaqHeroBanner;
