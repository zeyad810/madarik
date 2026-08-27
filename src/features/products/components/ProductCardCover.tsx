"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FreeRosetteBadge } from "./FreeRosetteBadge";
import { getSafeImageUrl, DEFAULT_BROKEN_IMAGE } from "@/features/story/types";

interface ProductCardCoverProps {
  imageSrc: string;
  imageAlt: string;
  isFree?: boolean;
  availability?: "free" | "paid" | string;
  ageRange?: string;
  levelTag?: string;
}

export const ProductCardCover: React.FC<ProductCardCoverProps> = ({
  imageSrc,
  imageAlt,
  isFree = true,
  availability,
  ageRange,
  levelTag,
}) => {
  const [imgSrc, setImgSrc] = useState(() => getSafeImageUrl(imageSrc));

  useEffect(() => {
    setImgSrc(getSafeImageUrl(imageSrc));
  }, [imageSrc]);

  return (
    <div className="relative w-full h-55 bg-gradient-to-br from-purple-50 to-slate-100 overflow-hidden select-none">
      {/* Story Cover Image */}
      <Image
        src={imgSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        onError={() => setImgSrc(DEFAULT_BROKEN_IMAGE)}
        unoptimized={imgSrc === DEFAULT_BROKEN_IMAGE}
      />

      {/* Overlay Dark Gradient Vignette for Text Contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

      {/* Rosette Ribbon Badge (Top Left) - Paid or Free */}
      <FreeRosetteBadge availability={availability} isFree={isFree} />

      {/* Age Range Badge (Top Right) - e.g. "5-9 سنة" */}
      {ageRange && (
        <div className="absolute top-3.5 right-3.5 z-10 bg-white/95 backdrop-blur-xs text-[#6D28D9] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm border border-purple-100/60 select-none">
          {ageRange}
        </div>
      )}
    </div>
  );
};

export default ProductCardCover;
