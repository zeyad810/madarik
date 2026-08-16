"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { usePublicLanding } from "../hooks/usePublicLanding";
import type { InstantReportFeature, InstantReportProps } from "../types";

const DEFAULT_ICONS = [
  "/assets/report.svg",
  "/assets/checkedbook.svg",
  "/assets/parent.svg",
  "/assets/school.svg",
];

// ==========================================
// Sub-components
// ==========================================
const FeatureRow = ({
  feature,
  index = 0,
}: {
  feature: InstantReportFeature;
  index?: number;
}) => (
  <motion.li
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: 0.2 + index * 0.1, ease: "easeOut" }}
    whileHover={{ x: -4, transition: { duration: 0.2 } }}
    className="flex items-center gap-4 cursor-default"
  >
    {feature.icon && (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mad-main/10 shadow-xs">
        <Image
          src={feature.icon}
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className="object-contain"
        />
      </div>
    )}
    <span className="mad-h6 font-semibold text-mad-text-primary">{feature.text}</span>
  </motion.li>
);

// ==========================================
// Main Component
// ==========================================
const InstantReport: React.FC<InstantReportProps> = ({
  title: propTitle,
  description: propDescription,
  features: propFeatures,
  ctaLabel = "ابدأ تجربتك المجانية الآن",
  ctaHref,
  onCtaClick,
  image = "/iamges/reportSecimg.png",
  imageAlt = "لوحة تحكم تقارير مدارك القراءة",
}) => {
  const { data: reportData } = usePublicLanding({
    select: (res) => res.data?.instant_report_section,
  });

  const title = propTitle ?? reportData?.title ?? "";
  const description = propDescription ?? reportData?.description ?? "";

  const features: InstantReportFeature[] =
    propFeatures ??
    (reportData?.points?.map((point, idx) => ({
      id: `point-${idx}`,
      text: point,
      icon: DEFAULT_ICONS[idx % DEFAULT_ICONS.length],
    })) ?? []);

  const handleCta = () => {
    if (ctaHref) window.open(ctaHref, "_blank", "noopener,noreferrer");
    else onCtaClick?.();
  };

  return (
    <section
      dir="rtl"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ==================== Image (right / start side in RTL) ==================== */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1 flex w-full items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-lg"
            >
              <Image
                src={image}
                alt={imageAlt}
                width={700}
                height={520}
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                style={{ width: "100%", height: "auto" }}
                className="object-contain drop-shadow-xl"
              />
            </motion.div>
          </motion.div>

          {/* ==================== Content (left / end side in RTL) ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 flex flex-col items-start text-right"
          >
            {/* Title */}
            <h2 className="mad-h2 font-bold" style={{ color: "#0B1120" }}>
              {title}
            </h2>

            {/* Description */}
            <p className="mad-h6 mt-4 max-w-xl leading-7" style={{ color: "#64748B" }}>
              {description}
            </p>

            {/* Feature list */}
            <ul dir="rtl" className="mt-8 flex flex-col gap-5">
              {features.map((f, index) => (
                <FeatureRow key={f.id} feature={f} index={index} />
              ))}
            </ul>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCta}
              className="mt-10 flex items-center gap-2 rounded-full bg-mad-main px-7 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-mad-main/90 active:scale-95 cursor-pointer"
            >
              {ctaLabel}
              <ArrowLeft className="size-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InstantReport;
