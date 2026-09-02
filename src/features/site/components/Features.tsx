"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { FeatureItem, FeaturesProps } from "../types";

const FEATURE_STYLES = [
  { accentColor: "var(--mad-third)", bgCircleColor: "var(--mad-orange-light)", imageSrc: "/assets/book.svg" },
  { accentColor: "var(--mad-main-light)", bgCircleColor: "rgba(139, 92, 246, 0.12)", imageSrc: "/assets/report.svg" },
  { accentColor: "var(--mad-secondary)", bgCircleColor: "var(--mad-green-light)", imageSrc: "/assets/checkedbook.svg" },
  { accentColor: "var(--mad-pink)", bgCircleColor: "rgba(234, 88, 12, 0.12)", imageSrc: "/assets/parent.svg" },
  { accentColor: "var(--mad-third)", bgCircleColor: "var(--mad-orange-light)", imageSrc: "/assets/school.svg" },
];

const Features: React.FC<FeaturesProps> = ({
  id: propId,
  title: propTitle,
  description: propDescription,
  subtitle,
  imageSrc,
  imageAlt,
  features: propFeatures,
}) => {
  const { data: whyUsData } = usePublicLanding({
    select: (res) => res.data?.why_us_section,
  });

  const id = propId ?? whyUsData?.id;
  const title = propTitle ?? whyUsData?.title ?? "";
  const description = propDescription ?? whyUsData?.description ?? "";

  const features: FeatureItem[] =
    propFeatures ??
    (whyUsData?.items?.map((item, idx) => {
      const style = FEATURE_STYLES[idx % FEATURE_STYLES.length];
      return {
        id: idx,
        title: item.title,
        description: item.description,
        accentColor: style.accentColor,
        bgCircleColor: style.bgCircleColor,
        imageSrc: style.imageSrc,
      };
    }) ?? []);

  return (
    <section dir="rtl" id={id} className="relative w-full section-spacing px-4 md:px-8 bg-white">
      {/* Anchor targets for #features and #why-us */}
      <span id="features" className="sr-only absolute -top-24 pointer-events-none" />
      <span id="why-us" className="sr-only absolute -top-24 pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center">
        {/* Section Header */}
        <SectionHeader
          title={title}
          description={description}
          subtitle={subtitle}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          align="center"
          className="mb-12 md:mb-16 max-w-3xl"
        />

        {/* Features Cards Grid: 2 columns side-by-side on mobile, centered on desktop */}
        <div className="w-full grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              index={index}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
              bgCircleColor={feature.bgCircleColor}
              icon={feature.icon}
              imageSrc={feature.imageSrc}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] md:max-w-70 [&:nth-child(odd):last-child]:col-span-2 [&:nth-child(odd):last-child]:w-[calc(50%-6px)] [&:nth-child(odd):last-child]:justify-self-center md:[&:nth-child(odd):last-child]:w-[calc(50%-12px)] lg:[&:nth-child(odd):last-child]:w-[calc(25%-18px)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
