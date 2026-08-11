import React from "react";
import Image from "next/image";
import { FreeRosetteBadge } from "./FreeRosetteBadge";

interface ProductCardCoverProps {
  imageSrc: string;
  imageAlt: string;
  isFree?: boolean;
  ageRange?: string;
}

export const ProductCardCover: React.FC<ProductCardCoverProps> = ({
  imageSrc,
  imageAlt,
  isFree = true,
  ageRange,
}) => {
  return (
    <div className="relative w-full h-[220px] bg-slate-100 overflow-hidden select-none">
      {/* Story Cover Image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        priority
      />

      {/* Overlay Dark Gradient Vignette for Text Contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

      {/* Free Rosette Ribbon Badge (Top Left) */}
      {isFree && <FreeRosetteBadge />}

      {/* Age Range Pill Badge (Top Right) */}
      {ageRange && (
        <div className="absolute top-3.5 right-3.5 z-10 bg-white/95 backdrop-blur-xs text-[#6D28D9] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm border border-purple-100/60 select-none">
          {ageRange}
        </div>
      )}
    </div>
  );
};

export default ProductCardCover;
