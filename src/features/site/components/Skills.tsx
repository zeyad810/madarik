"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { SkillCardItem, SkillsProps } from "../types";

const CARD_STYLES = [
  { accentColor: "#14b8a6", imageSrc: "/assets/pie-chart.svg" },
  { accentColor: "#8b5cf6", imageSrc: "/assets/user-performance-analytics.svg" },
  { accentColor: "#fbbf24", imageSrc: "/assets/magnifying-glass-icon-search.svg" },
  { accentColor: "#ec4899", imageSrc: "/assets/school 2.svg" },
];

const Skills: React.FC<SkillsProps> = ({
  title: propTitle,
  description: propDescription,
  rightCards: propRightCards,
  leftCards: propLeftCards,
}) => {
  const { data: moreThanStoriesData } = usePublicLanding({
    select: (res) => res.data?.more_than_stories_section,
  });

  const title = propTitle ?? moreThanStoriesData?.title ?? "";
  const description = propDescription ?? moreThanStoriesData?.description ?? "";

  const items = moreThanStoriesData?.items ?? [];

  const rightCards: SkillCardItem[] =
    propRightCards ??
    items
      .filter((_, idx) => idx % 2 === 0)
      .map((item, idx) => {
        const originalIdx = idx * 2;
        const style = CARD_STYLES[originalIdx % CARD_STYLES.length];
        return {
          id: `card-${originalIdx}`,
          title: item.title,
          description: item.description,
          accentColor: style.accentColor,
          imageSrc: style.imageSrc,
        };
      });

  const leftCards: SkillCardItem[] =
    propLeftCards ??
    items
      .filter((_, idx) => idx % 2 === 1)
      .map((item, idx) => {
        const originalIdx = idx * 2 + 1;
        const style = CARD_STYLES[originalIdx % CARD_STYLES.length];
        return {
          id: `card-${originalIdx}`,
          title: item.title,
          description: item.description,
          accentColor: style.accentColor,
          imageSrc: style.imageSrc,
        };
      });

  return (
    <section dir="rtl" className="w-full bg-[#f8fafc]/50 section-spacing px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 xl:gap-16">
        
        {/* Text & Action Side (Right in RTL layout) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-right order-1"
        >
          <h2 className="mad-h2 font-extrabold text-mad-text-primary mb-4 md:mb-6 leading-tight">
            {title}
          </h2>
          <p className="mad-body-1 text-mad-text-secondary font-normal mb-8 leading-relaxed max-w-xl">
            {description}
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              btnLink="#"
              btnText="ابدأ تجربتك المجانية الآن"
              btnType="fit"
              icon="have"
              btnBackground="var(--mad-main)"
              btnColor="#ffffff"
              className="px-7 py-3.5 mad-body-2 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Cards Side (Left in RTL layout) */}
        <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-8 order-2">
          {/* Right Column of Cards (inner column, next to text) */}
          <div className="flex flex-col gap-5 lg:gap-8">
            {rightCards.map((card, idx) => (
              <FeatureCard
                key={card.id}
                index={idx}
                title={card.title}
                description={card.description}
                accentColor={card.accentColor}
                imageSrc={card.imageSrc}
                className="items-start text-start shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              />
            ))}
          </div>

          {/* Left Column of Cards (outer left column, shifted down on desktop) */}
          <div className="flex flex-col gap-5 lg:gap-8 lg:translate-y-8">
            {leftCards.map((card, idx) => (
              <FeatureCard
                key={card.id}
                index={idx + 2}
                title={card.title}
                description={card.description}
                accentColor={card.accentColor}
                imageSrc={card.imageSrc}
                className="items-start text-start shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
