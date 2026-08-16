"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChildWinCardItem } from "../types";

interface ChildWinCardProps {
  item: ChildWinCardItem;
  className?: string;
  index?: number;
}

export const ChildWinCard: React.FC<ChildWinCardProps> = ({
  item,
  className = "",
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
      className={`relative bg-white/95 backdrop-blur-md rounded-2xl md:rounded-[24px] pt-8 pb-7 px-6 md:px-7 shadow-[0_10px_35px_rgba(109,40,217,0.06)] border border-purple-50/80 hover:shadow-[0_18px_40px_rgba(109,40,217,0.12)] transition-shadow duration-300 text-center flex flex-col items-center justify-center max-w-sm mx-auto w-full ${className}`}
    >
      {/* Floating Badge at Top Center */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 + index * 0.1 }}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#6D28D9] text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-md border-2 border-white z-10"
      >
        {item.number}
      </motion.div>

      {/* Card Title */}
      <h3 className="mad-h6 font-bold text-[#6D28D9] mb-2 sm:mb-3">
        {item.title}
      </h3>

      {/* Card Description */}
      <p className="mad-body-2 text-mad-text-secondary leading-relaxed font-normal">
        {item.description}
      </p>

      {/* Purple accent indicator line */}
      <div className="w-9 h-1 bg-[#6D28D9] rounded-full mt-4" />
    </motion.div>
  );
};

export default ChildWinCard;
