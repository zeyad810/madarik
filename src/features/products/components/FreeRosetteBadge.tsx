import React from "react";
import Image from "next/image";

export interface FreeRosetteBadgeProps {
  availability?: "free" | "paid" | string;
  isFree?: boolean;
  className?: string;
}

export const FreeRosetteBadge: React.FC<FreeRosetteBadgeProps> = ({
  availability,
  isFree,
  className = "",
}) => {
  const isPaid =
    availability === "paid" ||
    (availability !== "free" && isFree === false);

  const iconSrc = isPaid ? "/iamges/paidIcon.svg" : "/iamges/freeIcon.svg";
  const altText = isPaid ? "مدفوعة" : "مجانية";

  return (
    <div
      className={`absolute top-2.5 left-2.5 z-10 flex items-center justify-center pointer-events-none select-none transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <Image
        src={iconSrc}
        alt={altText}
        width={78}
        height={54}
        className="w-16 sm:w-18 h-auto drop-shadow-md"
        priority
      />
    </div>
  );
};

export default FreeRosetteBadge;
