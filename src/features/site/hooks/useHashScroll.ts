"use client";

import { useEffect, useCallback } from "react";

interface UseHashScrollOptions {
  /**
   * Optional boolean flag indicating whether asynchronous page data has loaded.
   * Scrolling will trigger once this becomes true (or immediately if omitted).
   */
  isReady?: boolean;
  /**
   * Additional offset from the top in pixels (defaults to 60px to account for fixed header).
   */
  offset?: number;
}

export function useHashScroll({ isReady = true, offset = 60 }: UseHashScrollOptions = {}) {
  const scrollToHash = useCallback(
    (targetHash?: string) => {
      if (typeof window === "undefined") return;

      const rawHash = targetHash ?? window.location.hash;
      if (!rawHash) return;

      const elementId = decodeURIComponent(rawHash.replace(/^#/, ""));
      if (!elementId) return;

      let attempts = 0;
      const maxAttempts = 15;
      const intervalMs = 100;

      const tryScroll = () => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
          return true;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryScroll, intervalMs);
        }
        return false;
      };

      // Slight delay to allow DOM render cycle / layout settling
      setTimeout(tryScroll, 50);
    },
    [offset]
  );

  useEffect(() => {
    if (!isReady) return;

    // Scroll on initial page load if hash is present
    scrollToHash();

    // Listen for hash changes (e.g. when clicking anchor links)
    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isReady, scrollToHash]);

  return { scrollToHash };
}
