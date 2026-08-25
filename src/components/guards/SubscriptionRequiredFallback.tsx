"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Crown, BookOpen, BarChart3, Award } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export interface SubscriptionRequiredFallbackProps {
  title?: string;
  message?: string;
  className?: string;
}

export const SubscriptionRequiredFallback: React.FC<SubscriptionRequiredFallbackProps> = ({
  title = "يجب عليك الاشتراك للاستمرار",
  message = "تقارير تقدم الأطفال وإحصائيات القراءة والتقييمات التفصيلية متاحة حصرياً للمشتركين في باقات مدارك.",
  className = "",
}) => {
  const benefits = [
    {
      icon: BarChart3,
      title: "تقارير شاملة للأداء",
      desc: "تحليل دقيق لمعدل درجات واختبارات كل طفل ومستوى استيعابه القرائي.",
    },
    {
      icon: BookOpen,
      title: "سجل القراءة التفاعلي",
      desc: "متابعة زمنية مفصلة للقصص التي تمت قراءتها والمدة المستغرقة.",
    },
    {
      icon: Award,
      title: "لوحة تحكم تفاعلية",
      desc: "إحصائيات فورية وتوصيات ذكية لتطوير المهارات اللغوية لطفلك.",
    },
  ];

  return (
    <div
      className={`w-full min-h-screen bg-slate-50/50 section-spacing pb-20! ${className}`}
      dir="rtl"
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/"
                  className="text-mad-text-secondary hover:text-mad-main font-medium"
                >
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-mad-main font-bold">
                  تقارير الأطفال
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl text-center flex flex-col items-center relative overflow-hidden"
        >
          {/* Top Decorative Background Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

          {/* Premium Icon Badge */}
          <div className="relative mb-6">
            <div className="size-20 sm:size-24 rounded-3xl bg-gradient-to-tr from-[#7939E3] to-[#A855F7] text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Crown className="size-10 sm:size-12 stroke-[2.2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="size-4" />
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            {title}
          </h1>
          <p className="text-gray-600 max-w-xl text-sm sm:text-base leading-relaxed mb-10">
            {message}
          </p>

          {/* Feature Highlights Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-right">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF5FF] border border-[#E9D5FF]/70 rounded-2xl p-5 flex flex-col gap-2 transition-all hover:shadow-md"
                >
                  <div className="size-10 rounded-xl bg-[#7939E3] text-white flex items-center justify-center mb-1">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/subscriptions"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="size-5" />
              <span>الاشتراك الآن في الباقة</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-slate-200 hover:border-slate-300 bg-white text-gray-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
            >
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionRequiredFallback;
