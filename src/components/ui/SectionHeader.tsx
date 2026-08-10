import React from "react";
import Image from "next/image";
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
    <div
      className={`flex flex-col gap-2 ${alignmentClasses[align]} ${className}`}
    >
      {imageSrc && (
        <div className="mb-2">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="object-contain"
          />
        </div>
      )}

      {subtitle && (
        <span
          className={`text-sm md:text-base font-bold text-mad-third ${subtitleClassName}`}
        >
          {subtitle}
        </span>
      )}

      <h2
        className={`text-2xl md:text-4xl font-bold text-mad-text-primary tracking-tight ${titleClassName}`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`text-sm md:text-base w-full md:w-[67%] text-mad-text-secondary leading-relaxed mt-1 ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
