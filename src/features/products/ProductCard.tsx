"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProductCardProps } from "./types";
import { ProductCardCover } from "./components/ProductCardCover";
import { ProductCardTags } from "./components/ProductCardTags";
import { ProductCardButton } from "./components/ProductCardButton";
import { DEFAULT_PRODUCT } from "./productData";

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  title: titleProp,
  description: descriptionProp,
  imageSrc: imageSrcProp,
  imageAlt: imageAltProp,
  ageRange: ageRangeProp,
  isFree: isFreeProp,
  levelTag: levelTagProp,
  storyCodeTag: storyCodeTagProp,
  ctaText: ctaTextProp,
  ctaLink: ctaLinkProp,
  onCtaClick,
  className = "",
}) => {
  // Extract values with fallbacks to DEFAULT_PRODUCT
  const title = titleProp ?? product?.title ?? DEFAULT_PRODUCT.title;
  const description =
    descriptionProp ?? product?.description ?? DEFAULT_PRODUCT.description;
  const imageSrc =
    imageSrcProp ?? product?.imageSrc ?? DEFAULT_PRODUCT.imageSrc!;
  const imageAlt =
    imageAltProp ?? product?.imageAlt ?? DEFAULT_PRODUCT.imageAlt ?? title;
  const ageRange = ageRangeProp ?? product?.ageRange ?? DEFAULT_PRODUCT.ageRange;
  const isFree = isFreeProp ?? product?.isFree ?? DEFAULT_PRODUCT.isFree;
  const levelTag = levelTagProp ?? product?.levelTag ?? DEFAULT_PRODUCT.levelTag;
  const storyCodeTag =
    storyCodeTagProp ?? product?.storyCodeTag ?? DEFAULT_PRODUCT.storyCodeTag;
  const ctaText = ctaTextProp ?? product?.ctaText ?? DEFAULT_PRODUCT.ctaText;
  const ctaLink = ctaLinkProp ?? product?.ctaLink;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      dir="rtl"
      className={`group w-full max-w-sm bg-white rounded-[28px] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(109,40,217,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* 1. Cover Image Header with Rosette & Age Badges */}
      <ProductCardCover
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        isFree={isFree}
        ageRange={ageRange}
      />

      {/* 2. Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags Row */}
          <ProductCardTags storyCodeTag={storyCodeTag} levelTag={levelTag} />

          {/* Story Title */}
          <h3 className="mad-h6 font-bold text-[#1E293B] mb-2.5 text-right leading-snug group-hover:text-mad-main transition-colors">
            {title}
          </h3>

          {/* Story Description */}
          <p className="mad-body-3 text-mad-text-secondary text-right font-normal leading-relaxed mb-6 line-clamp-2">
            {description}
          </p>
        </div>

        {/* 3. Bottom Action Button */}
        <ProductCardButton
          ctaText={ctaText}
          ctaLink={ctaLink}
          onCtaClick={onCtaClick}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;