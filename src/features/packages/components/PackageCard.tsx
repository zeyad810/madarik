"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PackagePlan } from "../types";

export interface PackageCardProps {
  pkg: PackagePlan;
  index?: number;
  onSelect?: (pkg: PackagePlan) => void;
  ctaOverrideText?: string;
  isUpgrade?: boolean;
}

const WhatsAppIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12C2 13.818 2.485 15.523 3.332 16.992L2.086 21.543C1.988 21.902 2.316 22.228 2.674 22.127L7.172 20.852C8.618 21.603 10.26 22.022 12 22.022C17.523 22.022 22 17.545 22 12.022C22 6.5 17.523 2 12 2Z"
      fill="#25D366"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.508 14.385C17.211 14.236 15.75 13.518 15.478 13.419C15.205 13.32 15.007 13.271 14.809 13.568C14.611 13.865 14.042 14.534 13.868 14.732C13.695 14.931 13.522 14.955 13.224 14.806C12.927 14.657 11.97 14.344 10.835 13.333C9.952 12.545 9.355 11.572 9.181 11.274C9.008 10.977 9.162 10.816 9.311 10.668C9.444 10.535 9.608 10.321 9.756 10.147C9.905 9.974 9.954 9.85 10.054 9.652C10.153 9.454 10.103 9.281 10.029 9.132C9.955 8.983 9.36 7.521 9.112 6.927C8.871 6.347 8.626 6.427 8.444 6.417C8.271 6.409 8.073 6.407 7.875 6.407C7.677 6.407 7.355 6.481 7.083 6.779C6.411 7.476 6 8.36 6 9.278C6 10.741 7.065 12.154 7.213 12.353C7.362 12.551 9.309 15.553 12.29 16.84C13 17.147 13.553 17.33 13.985 17.466C14.697 17.693 15.345 17.661 15.856 17.584C16.427 17.499 17.614 16.865 17.862 16.171C18.11 15.477 18.11 14.882 18.035 14.758C17.961 14.634 17.763 14.56 17.466 14.411L17.508 14.385Z"
      fill="white"
    />
  </svg>
);

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  index = 0,
  onSelect,
  ctaOverrideText,
  isUpgrade = false,
}) => {
  const router = useRouter();
  const isWhatsApp = pkg.ctaType === "whatsapp" || pkg.audience === "school";

  const handleCta = () => {
    if (onSelect) {
      onSelect(pkg);
      return;
    }

    if (isWhatsApp) {
      const waUrl = pkg.ctaLink || "https://wa.me/966500000000";
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/register?package=${pkg.id}`);
    }
  };

  const buttonText =
    ctaOverrideText ||
    pkg.ctaText ||
    (isUpgrade ? "ترقية الآن" : isWhatsApp ? "اشترك عبر الواتساب" : "اشترك الآن");

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative flex flex-col rounded-[28px] border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-mad-main/30 text-right w-full"
      dir="rtl"
    >
      {/* 3D Icon illustration */}
      <div className="flex justify-center items-center h-20 mb-3">
        <div className="relative w-24 h-20">
          <Image
            src={pkg.icon}
            alt={pkg.name}
            fill
            sizes="120px"
            className="object-contain"
            priority={index < 2}
          />
        </div>
      </div>

      {/* Package Title */}
      <h3 className="text-center text-xl sm:text-2xl font-bold text-mad-main">
        {pkg.name}
      </h3>

      {/* Subtitle / Description */}
      {pkg.description && (
        <p className="mt-1 text-center text-xs sm:text-sm text-gray-500 min-h-[38px] flex items-center justify-center">
          {pkg.description}
        </p>
      )}

      {/* Age Categories */}
      {pkg.ageCategories && pkg.ageCategories.length > 0 && (
        <div className="mt-4">
          <p className="text-center text-xs font-semibold text-mad-main mb-2">
            الفئات العمرية
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pkg.ageCategories.map((age) => (
              <span
                key={age}
                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-mad-main border border-purple-100"
              >
                {age}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price block */}
      {pkg.price !== null && pkg.price !== undefined ? (
        <div className="mt-5 text-center">
          <div className="flex items-baseline justify-center gap-2" dir="rtl">
            {pkg.discountedPrice ? (
              <>
                <span className="text-4xl font-extrabold text-mad-main">
                  {pkg.discountedPrice}
                </span>
                <span className="text-sm font-medium line-through text-gray-400">
                  {pkg.price}
                </span>
              </>
            ) : (
              <span className="text-4xl font-extrabold text-mad-main">
                {pkg.price}
              </span>
            )}
            <span className="text-sm font-medium text-gray-600">
              {pkg.currency || "ر.س"} {pkg.durationLabel ? `/ ${pkg.durationLabel}` : ""}
            </span>
          </div>
          {pkg.annualNote && (
            <p className="mt-1 text-xs text-gray-400 font-normal">
              {pkg.annualNote}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-5 min-h-[52px]" />
      )}

      {/* Divider */}
      <hr className="my-5 border-gray-100" />

      {/* Features Checklist */}
      <ul className="flex flex-col gap-3.5 mb-8 flex-1">
        {pkg.features.map((feature, fIdx) => (
          <li key={fIdx} className="flex items-start gap-3 text-right">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-purple-50 border border-purple-200">
              <Check className="size-3.5 text-mad-main stroke-[2.8]" />
            </span>
            <span className="flex-1 text-xs sm:text-sm font-normal text-gray-700 leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Action CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCta}
        type="button"
        className={`mt-auto flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all cursor-pointer shadow-xs ${
          isWhatsApp
            ? "border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
            : "border border-mad-main text-mad-main hover:bg-mad-main/5 hover:border-mad-purple-800"
        }`}
      >
        {isWhatsApp && <WhatsAppIcon className="size-5 shrink-0" />}
        <span>{buttonText}</span>
      </motion.button>
    </motion.div>
  );
};

export default PackageCard;
