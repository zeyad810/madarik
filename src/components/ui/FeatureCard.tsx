import React from "react";
import Image from "next/image";

export interface FeatureCardProps {
  title: string;
  description: string;
  accentColor?: string;
  bgCircleColor?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  accentColor = "var(--mad-main-light)",
  bgCircleColor = "rgba(139, 92, 246, 0.12)",
  icon,
  imageSrc,
  className = "",
}) => {
  return (
    <div
      className={`group bg-white rounded-3xl py-4 px-3 md:p-6 xl:py-5 xl:px-8 flex flex-col items-center text-center lg:items-start lg:text-start border border-slate-100 border-t-[5px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden w-full ${className}`}
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
            style={{ width: "auto", height: "auto" }}
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
      <p className="mad-body-3 text-[12px] md:text-[14px] lg:text-[16px] text-mad-text-secondary font-normal">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
