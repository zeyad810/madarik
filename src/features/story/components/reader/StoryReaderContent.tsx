"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { StoryBlock, getSafeImageUrl, DEFAULT_BROKEN_IMAGE } from "../../types";

interface StoryReaderContentProps {
  storyTitle: string;
  coverPhotoUrl: string | null;
  blocks: StoryBlock[];
  currentPage: number;
  children?: React.ReactNode;
}

export const StoryReaderContent: React.FC<StoryReaderContentProps> = ({
  storyTitle,
  coverPhotoUrl,
  blocks,
  currentPage,
  children,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8 text-right"
      >
        {blocks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium">
            لا يوجد محتوى متوفر لهذه الصفحة حالياً.
          </div>
        ) : (
          blocks.map((block) => {
            if (block.block_type === "image") {
              const imgUrl = getSafeImageUrl(block.content || coverPhotoUrl);

              return (
                <div
                  key={block.id}
                  className="flex flex-col items-center my-4 w-full"
                >
                  <div className="relative w-full aspect-video sm:aspect-21/9 max-h-110 rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
                    <Image
                      src={imgUrl}
                      alt={storyTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 950px"
                      className="object-cover"
                      unoptimized={imgUrl === DEFAULT_BROKEN_IMAGE}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-semibold mt-2.5">
                    {storyTitle}
                  </span>
                </div>
              );
            }

            return (
              <p
                key={block.id}
                className="text-base sm:text-lg md:text-xl text-[#334155] leading-loose font-medium text-right"
              >
                {block.content}
              </p>
            );
          })
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  );
};
