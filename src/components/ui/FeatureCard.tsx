"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface FeatureCardProps {
  title: string;
  description: string;
  accentColor?: string;
  bgCircleColor?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  className?: string;
  index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  accentColor = "var(--mad-main-light)",
  bgCircleColor = "rgba(139, 92, 246, 0.12)",
  icon,
  imageSrc,
  className = "",
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 xl:py-6 xl:px-7 flex flex-col items-center text-center border border-slate-100 border-t-[5px] shadow-[0_6px_24px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
      style={{
        borderTopColor: accentColor,
      }}
    >
      {/* Icon Container */}
      <div className="size-12 sm:size-14 md:size-16 mb-3 sm:mb-4 md:mb-5 shrink-0 my-2 sm:my-3 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            width={64}
            height={64}
            className="size-12 sm:size-14 md:size-16 object-contain"
          />
        ) : (
          <div
            className="size-12 sm:size-14 md:size-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bgCircleColor }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base md:mad-h6 text-mad-text-primary font-bold mb-1.5 sm:mb-2 md:mb-3 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[11px] sm:text-xs md:text-sm text-mad-text-secondary font-normal leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
