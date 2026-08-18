"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FreeRosetteBadge } from "./FreeRosetteBadge";

interface ProductCardCoverProps {
  imageSrc: string;
  imageAlt: string;
  isFree?: boolean;
  ageRange?: string;
  levelTag?: string;
}

export const ProductCardCover: React.FC<ProductCardCoverProps> = ({
  imageSrc,
  imageAlt,
  isFree = true,
  ageRange,
  levelTag,
}) => {
  // If backend returns a dead/offline placeholder URL, fallback gracefully
  const isBrokenPlaceholder =
    !imageSrc || imageSrc.includes("via.placeholder.com");
  const fallbackSrc = "/assets/sea_story.png";
  const [currentSrc, setCurrentSrc] = useState(
    isBrokenPlaceholder ? fallbackSrc : imageSrc
  );

  return (
    <div className="relative w-full h-55 bg-slate-100 overflow-hidden select-none">
      {/* Story Cover Image */}
      <Image
        src={currentSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        priority
        onError={() => setCurrentSrc(fallbackSrc)}
      />

      {/* Overlay Dark Gradient Vignette for Text Contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

      {/* Free Rosette Ribbon Badge (Top Left) */}
      {isFree && <FreeRosetteBadge />}

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
