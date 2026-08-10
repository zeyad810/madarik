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
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      )}

      {subtitle && (
        <span
          className={`mad-label-1 font-bold text-mad-third ${subtitleClassName}`}
        >
          {subtitle}
        </span>
      )}

      <h2
        className={`mad-h2 font-bold text-mad-text-primary ${titleClassName}`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mad-body-1 w-full md:w-[67%] text-mad-text-secondary mt-1 ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
