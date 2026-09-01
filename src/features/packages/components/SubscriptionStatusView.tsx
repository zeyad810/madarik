"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCurrentSubscription } from "../hooks/usePackages";

export const SubscriptionStatusView: React.FC = () => {
  const { data: subscription, isLoading } = useCurrentSubscription();

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start mb-6">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" className="text-mad-main font-bold hover:underline">
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-gray-500 font-medium">
                  حالة اشتراكي
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. SUBSCRIPTION STATUS MAIN CARD / EMPTY STATE
           ========================================================================= */}
        {isLoading ? (
          <div className="max-w-4xl mx-auto h-96 rounded-[28px] bg-gray-50/70 animate-pulse border border-gray-200" />
        ) : subscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl mx-auto rounded-[28px] border border-gray-200/90 bg-white p-6 sm:p-10 shadow-sm"
          >
            {/* Top Bar: Plan Name + Subtitle + Renew Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-100">
              <div className="text-right space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {subscription.planName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">
                  {subscription.subtitle || "اشتراك طفلك الحالي النشط"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/packages/renew"
                  className="px-5 py-2.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>تجديد أو ترقية الاشتراك</span>
                  <ArrowLeft className="size-4 rotate-180" />
                </Link>
              </div>
            </div>

            {/* Details Grid (2 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-12 pt-8">
              {/* 1. Start Date */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  تاريخ بدء الاشتراك:
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {subscription.startDate}
                </span>
              </div>

              {/* 2. End Date */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  تاريخ انتهاء الاشتراك:
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {subscription.endDate}
                </span>
              </div>

              {/* 3. Age Category */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  الفئات العمرية المفتوحة:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  {subscription.unlockedAgeCategories && subscription.unlockedAgeCategories.length > 0 ? (
                    subscription.unlockedAgeCategories.map((age) => (
                      <span
                        key={age}
                        className="rounded-full bg-purple-50 text-mad-main text-xs font-semibold px-2.5 py-0.5 border border-purple-100"
                      >
                        {age}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-purple-50 text-mad-main text-xs font-semibold px-3 py-1 border border-purple-100">
                      {subscription.ageCategory || "-"}
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  طريقة الدفع:
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {subscription.paymentMethod}
                </span>
              </div>

              {/* 5. Paid Price */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  المبلغ المدفوع:
                </span>
                <span className="text-xs sm:text-sm font-bold text-mad-main">
                  {subscription.paidPriceText || subscription.monthlyPriceText || "-"}
                </span>
              </div>

              {/* 6. Status Badge */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  حالة الباقة:
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    subscription.status === "active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}
                >
                  <span className="size-2 rounded-full bg-current animate-pulse" />
                  {subscription.statusLabel || (subscription.status === "active" ? "نشط" : "منتهي")}
                </span>
              </div>
            </div>

            {/* Quick Links Footer */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/packages/renew"
                className="text-xs sm:text-sm font-bold text-mad-main hover:underline inline-flex items-center gap-1.5"
              >
                <RefreshCw className="size-4" />
                <span>تجديد أو ترقية الاشتراك الحالي</span>
              </Link>
              <Link
                href="/packages/history"
                className="text-xs sm:text-sm font-bold text-gray-600 hover:text-mad-main hover:underline"
              >
                عرض سجل وفواتير الباقات السابقة ←
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto rounded-[28px] border border-gray-200/90 bg-white p-8 sm:p-12 text-center shadow-sm space-y-4"
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
                <ArrowLeft className="size-4 rotate-180" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatusView;

