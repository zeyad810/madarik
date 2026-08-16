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
      className={`group bg-white rounded-3xl py-4 px-3 md:p-6 xl:py-5 xl:px-8 flex flex-col items-center text-center lg:items-start lg:text-start border border-slate-100 border-t-[5px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full ${className}`}
      style={{
        borderTopColor: accentColor,
      }}
    >
      {/* Icon Container */}
      <div className="w-16 h-16 mb-5 shrink-0 my-5 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bgCircleColor }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mad-h6 text-mad-text-primary font-semibold mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="mad-body-4 md:mad-body-3 lg:mad-body-2 text-mad-text-secondary font-normal">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
