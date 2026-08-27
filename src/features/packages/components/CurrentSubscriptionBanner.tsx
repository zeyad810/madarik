"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CurrentSubscription } from "../types";
import { FreezeSubscriptionModal } from "./FreezeSubscriptionModal";

interface CurrentSubscriptionBannerProps {
  subscription: CurrentSubscription;
}

export const CurrentSubscriptionBanner: React.FC<CurrentSubscriptionBannerProps> = ({
  subscription,
}) => {
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

  return (
    <>
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
            `سيتم التجديد تلقائياً في ${subscription.autoRenewDate || "30 سبتمبر 2026"}، بإمكانك تجديد اشتراكك أو تغييره باقة متقدمة في أي وقت.`}
        </p>

        {/* Action Button: Freeze */}
        <div className="mt-5 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFreezeModalOpen(true)}
            type="button"
            className="px-8 py-2.5 rounded-full border border-mad-main text-mad-main hover:bg-mad-main hover:text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            {subscription.isFrozen ? "إلغاء التجميد" : "تجميد الآن"}
          </motion.button>
        </div>
      </motion.div>

      {/* Freeze Modal */}
      <FreezeSubscriptionModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        currentPlanName={subscription.planName}
      />
    </>
  );
};

export default CurrentSubscriptionBanner;
