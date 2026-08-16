"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { StepCard } from "./StepCard";
import { StepItem, HowItWorksProps } from "../types";

const STEP_COLORS = [
  "var(--mad-main)",      // Purple
  "var(--mad-third)",     // Amber / Yellow
  "var(--mad-secondary)", // Teal
  "var(--mad-pink)",      // Pink
];

const HowItWorks: React.FC<HowItWorksProps> = ({
  title: propTitle,
  subtitle: propSubtitle,
  steps: propSteps,
}) => {
  const { data: howItWorksData } = usePublicLanding({
    select: (res) => res.data?.how_it_works_section,
  });

  const title = propTitle ?? howItWorksData?.title ?? "";
  const subtitle = propSubtitle ?? howItWorksData?.description ?? "";

  const steps: StepItem[] =
    propSteps ??
    (howItWorksData?.steps?.map((step, idx) => ({
      id: idx + 1,
      number: step.number,
      title: step.title,
      description: step.description,
      color: STEP_COLORS[idx % STEP_COLORS.length],
    })) ?? []);

  return (
    <section dir="rtl" className="w-full bg-white section-spacing px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container mx-auto flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl px-4"
        >
          <h2 className="mad-h2 font-extrabold text-mad-text-primary mb-3 md:mb-4">
            {title}
          </h2>
          <p className="mad-body-2 text-mad-text-secondary font-medium">
            {subtitle}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 py-6 md:py-8">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
