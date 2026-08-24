"use client";

import React from "react";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { useHashScroll } from "../hooks/useHashScroll";

export interface HashScrollerProps {
  offset?: number;
}

/**
 * Headless client component that listens for URL hash (e.g. /#trust_section)
 * and smoothly scrolls to the target section once landing page data is loaded.
 */
export const HashScroller: React.FC<HashScrollerProps> = ({ offset = 40 }) => {
  const { isSuccess, isFetched } = usePublicLanding();

  useHashScroll({
    isReady: isSuccess || isFetched,
    offset,
  });

  return null;
};

export default HashScroller;
