"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useCurrentSubscription } from "../hooks/usePackages";

export const SubscriptionStatusView: React.FC = () => {
  const { data: subscription, isLoading } = useCurrentSubscription();

  const formattedPrice = useMemo(() => {
    if (!subscription) return "199 ر.س / سنوياً";
    if (subscription.paidPriceText && subscription.paidPriceText.includes("/")) {
      return subscription.paidPriceText;
    }
    if (subscription.paidPriceText) {
      const duration =
        subscription.durationLabel ||
        (subscription.packageType === "سنوي" ? "سنوياً" : "شهرياً");
      return `${subscription.paidPriceText} / ${duration}`;
    }
    if (subscription.paidPrice) {
      return `${subscription.paidPrice} ر.س / ${
        subscription.durationLabel || "سنوياً"
      }`;
    }
    return "199 ر.س / سنوياً";
  }, [subscription]);

  const ageCategories = useMemo(() => {
    if (
      subscription?.unlockedAgeCategories &&
      subscription.unlockedAgeCategories.length > 0
    ) {
      return subscription.unlockedAgeCategories;
    }
    if (subscription?.ageCategory) {
      return [subscription.ageCategory];
    }
    return ["6-8 سنوات"];
  }, [subscription]);

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION (الرئيسية > حاله اشتراكي)
           ========================================================================= */}
        <div className="flex items-center justify-start mb-6 sm:mb-8 text-xs sm:text-sm">
          <Link
            href="/"
            className="text-mad-main font-bold underline underline-offset-4 decoration-mad-main hover:opacity-85 transition-opacity"
          >
            الرئيسية
          </Link>
          <span className="mx-2 text-gray-400 select-none">&gt;</span>
          <span className="text-gray-400 font-medium">حاله اشتراكي</span>
        </div>

        {/* =========================================================================
            2. SUBSCRIPTION STATUS CARD / SKELETON / EMPTY STATE
           ========================================================================= */}
        {isLoading ? (
          <div className="w-full rounded-[32px] sm:rounded-[36px] border border-gray-100 bg-white p-6 sm:p-10 lg:p-12 shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-8 animate-pulse">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="space-y-2">
                <div className="h-7 w-40 bg-gray-200 rounded-lg" />
                <div className="h-4 w-48 bg-gray-100 rounded-md" />
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="h-5 w-48 bg-gray-100 rounded" />
              <div className="h-5 w-48 bg-gray-100 rounded" />
              <div className="h-5 w-44 bg-gray-100 rounded" />
              <div className="h-5 w-44 bg-gray-100 rounded" />
              <div className="h-5 w-40 bg-gray-100 rounded" />
              <div className="h-5 w-32 bg-gray-100 rounded" />
            </div>
          </div>
        ) : subscription ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full rounded-[32px] sm:rounded-[36px] border border-gray-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-[0_2px_16px_rgba(0,0,0,0.02)]"
          >
            {/* Header: Plan Name, Subtitle, and Renew Action */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-gray-100">
              <div className="text-right space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {subscription.planName || "الباقة المتقدمة"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">
                  {subscription.subtitle || "اشتراك طفلك الفردي للمنصة"}
                </p>
              </div>

              <div className="flex items-center justify-start sm:justify-end">
                <Link
                  href="/packages/renew"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  <span>تجديد الباقة</span>
                  <ArrowLeft className="size-4 shrink-0" />
                </Link>
              </div>
            </div>

            {/* Details Grid (Aligned rows across 2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-8 lg:gap-x-16 pt-6 sm:pt-8">
              {/* Row 1 - Right: Start Date */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  تاريخ بدء الاشتراك:
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {subscription.startDate || "15 فبراير 2025"}
                </span>
              </div>

              {/* Row 1 - Left: End Date */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  تاريخ انتهاء الاشتراك:
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {subscription.endDate || "15 فبراير 2026"}
                </span>
              </div>

              {/* Row 2 - Right: Age Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  الفئة العمرية المحددة:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ageCategories.map((age, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full bg-[#F0EBFA] text-mad-main text-xs sm:text-sm font-bold"
                    >
                      {age}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 2 - Left: Payment Method */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  طريقة الدفع:
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {subscription.paymentMethod || "مدى ينتهي بـ (4032)"}
                </span>
              </div>

              {/* Row 3 - Right: Price & Fees */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  القيمة المالية والرسوم:
                </span>
                <span className="text-xs sm:text-sm font-bold text-mad-main">
                  {formattedPrice}
                </span>
              </div>

              {/* Row 3 - Left: Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                  حالة الباقة:
                </span>
                <span
                  className={`inline-flex items-center justify-center px-4 py-0.5 rounded-full text-xs sm:text-sm font-bold ${
                    subscription.status === "expired"
                      ? "bg-[#FEF2F2] text-[#EF4444]"
                      : subscription.status === "cancelled"
                      ? "bg-[#F3F4F6] text-[#6B7280]"
                      : "bg-[#E8F8EE] text-[#1DBF73]"
                  }`}
                >
                  {subscription.statusLabel ||
                    (subscription.status === "active" ? "نشط" : "منتهية")}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto rounded-[32px] border border-gray-200/80 bg-white p-8 sm:p-12 text-center shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4"
          >
            <div className="size-16 rounded-full bg-purple-50 flex items-center justify-center text-mad-main mx-auto mb-2">
              <ShieldCheck className="size-8 stroke-[1.8]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              لا يوجد اشتراك نشط حالياً
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              اشترك في إحدى باقات مدارك القراءة لتفعيل الوصول إلى المكتبة التفاعلية وتقارير أداء طفلك.
            </p>
            <div className="pt-4">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>تصفح واشترك في الباقات</span>
                <ArrowLeft className="size-4 shrink-0" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatusView;
