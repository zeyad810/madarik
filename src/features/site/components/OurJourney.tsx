"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { OurJourneyProps, OurJourneyStep } from "../types";

const JOURNEY_COLORS = ["#8B5CF6", "#FBC203", "#F55697"];

const OurJourney: React.FC<OurJourneyProps> = ({
  id: propId,
  title: propTitle,
  description: propDescription,
  subtitle,
  imageSrc = "/iamges/sectionHeading.png",
  imageAlt = "رحلتنا نحو صناعة جيل قارئ",
  steps: propSteps,
}) => {
  const { data: journeyData } = usePublicLanding({
    select: (res) => res.data?.journey_section,
  });

  const id = propId ?? journeyData?.id;
  const title = propTitle ?? journeyData?.title ?? "";
  const description = propDescription ?? journeyData?.subtitle ?? "";

  const steps: OurJourneyStep[] =
    propSteps ??
    (journeyData?.milestones?.map((milestone, idx) => ({
      id: `milestone-${idx}`,
      title: milestone.title,
      description: milestone.description,
      color: JOURNEY_COLORS[idx % JOURNEY_COLORS.length],
    })) ?? []);

  const step1 = steps[0];
  const step2 = steps[1];
  const step3 = steps[2];

  return (
    <section
      dir="rtl"
      id={id}
      className="relative w-full section-spacing px-4 sm:px-6 md:px-8 bg-white overflow-hidden"
    >
      <div className="container mx-auto flex flex-col items-center">
        {/* Section Header */}
        <SectionHeader
          title={title}
          description={description}
          subtitle={subtitle}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          align="center"
          className="mb-10 md:mb-16 max-w-3xl"
        />

        {/* ==================== Desktop Layout (lg and up) ==================== */}
        {step1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full mx-auto hidden lg:block pt-8 pb-28"
          >
            <div className="relative w-full aspect-1298/325">
              {/* Curved Path Graphic */}
              <Image
                src="/iamges/yourPath.svg"
                alt="مسار رحلتنا"
                fill
                className="object-contain pointer-events-none select-none"
                priority
              />

              {/* Step 1: من نحن؟ (Right side in RTL) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute flex flex-col items-center pointer-events-auto"
                style={{
                  right: "0.85%",
                  top: "46%",
                  transform: "translate(50%, -100%)",
                }}
              >
                <h3 className="mad-h5 font-bold text-mad-text-primary whitespace-nowrap mb-2">
                  {step1.title}
                </h3>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute flex flex-col items-center text-center pointer-events-auto"
                style={{
                  right: "0.85%",
                  top: "80%",
                  transform: "translateX(50%)",
                  width: "300px",
                }}
              >
                <p className="mad-body-2 text-mad-text-secondary leading-relaxed font-medium">
                  {step1.description}
                </p>
              </motion.div>

              {step2 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute flex flex-col items-center pointer-events-auto"
                    style={{
                      left: "48.48%",
                      top: "2%",
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <h3 className="mad-h5 font-bold text-mad-text-primary whitespace-nowrap mb-2">
                      {step2.title}
                    </h3>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute flex flex-col items-center text-center pointer-events-auto"
                    style={{
                      left: "39.38%",
                      top: "34%",
                      transform: "translateX(-50%)",
                      width: "340px",
                    }}
                  >
                    <p className="mad-body-2 text-mad-text-secondary leading-relaxed font-medium">
                      {step2.description}
                    </p>
                  </motion.div>
                </>
              )}

              {step3 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="absolute flex flex-col items-center pointer-events-auto"
                    style={{
                      left: "3.55%",
                      top: "46%",
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <h3 className="mad-h5 font-bold text-mad-text-primary whitespace-nowrap mb-2">
                      {step3.title}
                    </h3>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="absolute flex flex-col items-center text-center pointer-events-auto"
                    style={{
                      left: "0.55%",
                      top: "80%",
                      transform: "translateX(-50%)",
                      width: "300px",
                    }}
                  >
                    <p className="mad-body-2 text-mad-text-secondary leading-relaxed font-medium">
                      {step3.description}
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== Mobile Layout (Cards stack) ==================== */}
        <div className="flex lg:hidden flex-col gap-8 sm:gap-10 w-full max-w-md sm:max-w-lg mx-auto pt-4 pb-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative bg-white rounded-3xl sm:rounded-[28px] border-2 p-6 sm:p-8 pt-8 sm:pt-9 text-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md"
              style={{ borderColor: step.color }}
            >
              {/* Dot overlapping top center border */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-2 flex items-center justify-center">
                <span
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                  style={{ backgroundColor: step.color }}
                />
              </div>

              {/* Title */}
              <h3 className="mad-h4 font-bold text-mad-text-primary mb-3 sm:mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mad-body-2 text-mad-text-secondary leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurJourney;
