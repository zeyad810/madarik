"use client";

import React, { useState, useEffect, useRef } from "react";
import { Story, StoryBlock, getStoryQuizId } from "../types";
import { useStoryReadingTracker } from "../hooks/useStoryReadingTracker";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import { StoryReaderHeader } from "./reader/StoryReaderHeader";
import { StoryReaderContent } from "./reader/StoryReaderContent";
import { StoryReaderFinishActions } from "./reader/StoryReaderFinishActions";
import { StoryReaderNavigation } from "./reader/StoryReaderNavigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface StoryReaderViewProps {
  story: Story;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({ story }) => {
  const { isAuthenticated } = useActiveAccount();
  const contentTopRef = useRef<HTMLDivElement>(null);
  const isFirstMountRef = useRef(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Extract story blocks sorted by order
  const blocks: StoryBlock[] = story.blocks && story.blocks.length > 0
    ? [...story.blocks].sort((a, b) => a.order - b.order)
    : [];

  // Exactly 2 blocks per page
  const BLOCKS_PER_PAGE = 2;
  const totalPages = Math.max(
    1,
    blocks.length > 0
      ? Math.ceil(blocks.length / BLOCKS_PER_PAGE)
      : (story.pages_count ?? 1)
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (story) {
      console.log("Story:", story);
    }
  }, [story]);

  const router = useRouter();

  // Automatic reading lifecycle tracker (start, idle pause/resume, tab visibility, unload pause, finish)
  const {
    finishReading,
    isFinishing,
    isFinished,
  } = useStoryReadingTracker({
    storyId: story.id,
    currentPage,
    idleTimeoutMs: 90000,
  });

  const handleFinishStory = React.useCallback(() => {
    finishReading(() => {
      setTimeout(() => {
        router.push(`/stories/${story.id}`);
      }, 1000);
    });
  }, [finishReading, router, story.id]);

  // Smooth scroll to top of story content on page change
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  const startIndex = (currentPage - 1) * BLOCKS_PER_PAGE;
  const currentBlocks = blocks.slice(startIndex, startIndex + BLOCKS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNavigateToQuiz = () => {
    if (isAuthenticated && !isFinished) {
      handleFinishStory();
    }
  };

  const handleDownloadPdf = async () => {
    if (!story.pdf_url) return;
    try {
      setIsDownloadingPdf(true);
      const res = await fetch(story.pdf_url);
      if (!res.ok) throw new Error("Fetch error");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = `${story.title || "قصة"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("تم تحميل ملف PDF بنجاح");
    } catch {
      window.open(story.pdf_url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const hasQuiz = Boolean(getStoryQuizId(story));
  const isLastPage = currentPage === totalPages;

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* 1. Breadcrumbs */}
      <div className="mb-6">
        <AutoBreadcrumbs dynamicLabels={{ [story.id]: story.title }} />
      </div>

      {/* 2. Header & Top Action Controls */}
      <StoryReaderHeader
        story={story}
        isDownloadingPdf={isDownloadingPdf}
        onDownloadPdf={handleDownloadPdf}
        onNavigateToQuiz={handleNavigateToQuiz}
      />

      {/* Divider */}
      <hr className="border-slate-200/80 my-8" />

      {/* 3. Story Content Box */}
      <div
        ref={contentTopRef}
        className="scroll-mt-24"
      >
        <div className="text-center pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-mad-text-primary inline-flex items-center gap-2">
            <span>محتوى القصة</span>
          </h2>
        </div>

        <StoryReaderContent
          storyTitle={story.title}
          coverPhotoUrl={story.cover_photo_url}
          blocks={currentBlocks}
          currentPage={currentPage}
        >
          {isLastPage && (
            <StoryReaderFinishActions
              isFinishing={isFinishing}
              isFinished={isFinished}
              onFinishStory={handleFinishStory}
            />
          )}
        </StoryReaderContent>
      </div>

      {/* 4. Page Navigation Buttons */}
      <StoryReaderNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
};

export default StoryReaderView;
