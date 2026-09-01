"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CurrentSubscription } from "../types";

interface CurrentSubscriptionBannerProps {
  subscription: CurrentSubscription;
  hideActionButton?: boolean;
}

export const CurrentSubscriptionBanner: React.FC<CurrentSubscriptionBannerProps> = ({
  subscription,
  hideActionButton = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto rounded-[28px] bg-[#FFFBF0] border border-[#FDE68A]/80 p-6 sm:p-8 text-center relative overflow-hidden shadow-xs"
      dir="rtl"
    >
      {/* Crown Icon */}
      <div className="flex justify-center items-center mb-3">
        <div className="relative size-14 sm:size-16">
          <Image
            src="/iamges/crown-illustration.svg"
            alt="Crown illustration"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
        اشتراكك الحالي
      </h2>

      {/* Plan Name */}
      <p className="text-base sm:text-lg font-extrabold text-mad-main mt-1">
        {subscription.planName}
      </p>

      {/* Age Category Pill */}
      {subscription.ageCategory && (
        <div className="flex justify-center mt-2.5">
          <span className="rounded-full bg-purple-100/70 text-mad-main text-xs font-semibold px-3 py-1 border border-purple-200/60">
            {subscription.ageCategory}
          </span>
        </div>
      )}

      {/* Description / Auto-renew notice */}
      <p className="mt-3.5 text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
        {subscription.description ||
          `تم تفعيل اشتراكك بنجاح حتى تاريخ ${subscription.endDate || "نهاية الفترة"}، بإمكانك تجديد اشتراكك أو ترقيته في أي وقت.`}
      </p>

      {/* Action Button: تجديد الاشتراك */}
      {!hideActionButton && (
        <div className="mt-5 flex justify-center gap-3">
          <Link
            href="/packages/renew"
            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <span>تجديد الاشتراك</span>
            <ArrowLeft className="size-4 rotate-180" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default CurrentSubscriptionBanner;


