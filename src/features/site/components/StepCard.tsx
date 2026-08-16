"use client";

import React from "react";
import { motion } from "framer-motion";
import { StepItem } from "../types";

interface StepCardProps {
  step: StepItem;
  index?: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
      className="relative flex items-center w-full min-h-[140px] sm:min-h-[165px] md:min-h-[175px]"
    >
      {/* Capsule Frame Container composed of Two Divs */}
      <div className="relative flex-1 flex items-stretch min-h-[110px] sm:min-h-[140px] md:min-h-[160px]">
        {/* Right Div: Smaller segment under Circle Badge with Top & Bottom Border */}
        <div
          className="relative w-25 sm:w-[140px] md:w-[160px] flex-shrink-0 border-y-[3px] border-solid bg-white transition-colors duration-300"
          style={{ borderColor: step.color }}
        />

        {/* Left Div: Main body holding Description Text, rounded on left, with dots at start */}
        <div
          className="relative flex-1 flex items-center border-y-[3px] border-l-[3px] border-r-0 border-solid bg-white rounded-l-[50px] sm:rounded-l-[80px] md:rounded-l-[90px] pl-5 sm:pl-8 md:pl-10 pr-4 sm:pr-6 py-3 sm:py-4 transition-colors duration-300"
          style={{ borderColor: step.color }}
        >
          {/* Top Border Gap & Dot at start (right edge) of Left Div */}
          <div className="absolute -top-1.25 right-4 sm:right-2 lg:right-1 translate-x-1/2 bg-white ps-1.5 flex items-center justify-center z-10 -translate-y-0.5">
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: step.color }}
            />
          </div>

          {/* Bottom Border Gap & Dot at start (right edge) of Left Div */}
          <div className="absolute -bottom-1.25 right-4 sm:right-2 lg:right-1 translate-x-1/2 bg-white ps-1.5 flex items-center justify-center z-10 translate-y-0.5">
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: step.color }}
            />
          </div>

          {/* Description Text */}
          <p className="mad-body-4 sm:mad-body-2 md:mad-h6 text-mad-text-secondary font-medium text-right select-none">
            {step.description}
          </p>
        </div>
      </div>

      {/* Right Circle Badge Overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 bg-white">
        {/* Background Accent Circle (same ratio, slightly shifted) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none z-0 scale-[1.02] translate-x-2 -translate-y-2"
          style={{ backgroundColor: step.color }}
        />

        {/* White Main Circle */}
        <div className="relative z-10 w-[112px] h-[112px] sm:w-[144px] sm:h-[144px] md:w-[160px] md:h-[160px] rounded-full bg-white flex flex-col items-center justify-center text-center p-2.5 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100">
          <span className="mad-h3 font-extrabold text-mad-text-primary mb-0.5 sm:mb-1 md:mb-1.5 font-sans">
            {step.number}
          </span>
          <span className="mad-label-1 font-bold text-mad-text-primary max-w-[95px] sm:max-w-[110px]">
            {step.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StepCard;
