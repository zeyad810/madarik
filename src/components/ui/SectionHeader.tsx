"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { SectionHeaderProps } from "@/types";

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  subtitle,
  imageSrc,
  imageAlt = "Header icon",
  imageWidth = 80,
  imageHeight = 80,
  align = "center",
  titleClassName = "",
  subtitleClassName = "",
  descriptionClassName = "",
  className = "",
}) => {
  const alignmentClasses = {
    center: "text-center items-center",
    start: "text-start items-start",
    end: "text-end items-end",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={twMerge("flex flex-col gap-2", alignmentClasses[align], className)}
    >
      {imageSrc && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-2"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="object-contain w-auto h-auto"
          />
        </motion.div>
      )}

      {subtitle && (
        <span
          className={twMerge(
            subtitleClassName ? "" : "mad-label-1 font-bold text-mad-third",
            subtitleClassName
          )}
        >
          {subtitle}
        </span>
      )}

      <h2
        className={twMerge(
          titleClassName ? "" : "mad-h2 font-bold text-mad-text-primary",
          titleClassName
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={twMerge(
            descriptionClassName
              ? ""
              : "mad-body-1 w-full md:w-[67%] text-mad-text-secondary mt-1",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};
