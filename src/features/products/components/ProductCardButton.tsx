import React from "react";
import Link from "next/link";

interface ProductCardButtonProps {
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export const ProductCardButton: React.FC<ProductCardButtonProps> = ({
  ctaText = "ابدأ القراءة",
  ctaLink,
  onCtaClick,
}) => {
  const content = (
    <>
      <span>{ctaText}</span>
      {/* Left Arrow Icon */}
      <svg
        className="w-5 h-5 fill-current transition-transform duration-200 group-hover/btn:-translate-x-1"
        viewBox="0 0 24 24"
      >
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
    </>
  );

  const buttonClasses =
    "group/btn w-full py-3.5 px-6 bg-[#6D28D9] hover:bg-[#5B20B5] active:scale-[0.98] text-white font-bold text-base rounded-full shadow-[0_6px_20px_rgba(109,40,217,0.25)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.38)] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer text-center select-none";

  return (
    <div className="pt-4 border-t border-slate-100">
      {ctaLink ? (
        <Link href={ctaLink} className={buttonClasses}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onCtaClick} className={buttonClasses}>
          {content}
        </button>
      )}
    </div>
  );
};

export default ProductCardButton;
