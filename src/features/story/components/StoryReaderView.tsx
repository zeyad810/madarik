"use client";

import React, { useState, useEffect, useRef } from "react";
import { Story, StoryBlock, getStoryQuizId } from "../types";
import { useFinishStory } from "../hooks/useFinishStory";
import { useStartStory } from "../hooks/useStartStory";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import { StoryReaderHeader } from "./reader/StoryReaderHeader";
import { StoryReaderContent } from "./reader/StoryReaderContent";
import { StoryReaderFinishActions } from "./reader/StoryReaderFinishActions";
import { StoryReaderNavigation } from "./reader/StoryReaderNavigation";
import toast from "react-hot-toast";

interface StoryReaderViewProps {
  story: Story;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({ story }) => {
  const { mutate: markStoryStarted } = useStartStory(story.id);
  const {
    mutate: markStoryFinished,
    isPending: isFinishing,
    isSuccess: isFinished,
  } = useFinishStory(story.id);

  const hasStartedRef = useRef(false);
  const hasFinishedRef = useRef(false);
  const contentTopRef = useRef<HTMLDivElement>(null);
  const isFirstMountRef = useRef(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Record reading start once on mount
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      markStoryStarted(undefined, {
        onError: (err) => console.error("Start reading session error:", err),
      });
    }
  }, [markStoryStarted]);

  // Extract story blocks sorted by order
  const blocks: StoryBlock[] = story.blocks && story.blocks.length > 0
    ? [...story.blocks].sort((a, b) => a.order - b.order)
    : [];

  // Calculate pagination dynamically
  const totalPages = Math.max(
    1,
    story.pages_count ??
      (blocks.length > 0 ? Math.ceil(blocks.length / 2) : 1)
  );
  const itemsPerPage = Math.max(1, Math.ceil(blocks.length / totalPages));
  const [currentPage, setCurrentPage] = useState(1);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlocks = blocks.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleFinishStory = () => {
    if (hasFinishedRef.current || isFinishing || isFinished) return;
    hasFinishedRef.current = true;
    markStoryFinished(undefined, {
      onSuccess: (res) => {
        toast.success(res?.message || "تم تسجيل إنهاء قراءة القصة بنجاح 🎉");
      },
      onError: (err: unknown) => {
        hasFinishedRef.current = false;
        const msg =
          err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل إنهاء القصة";
        toast.error(msg);
      },
    });
  };

  const handleNavigateToQuiz = () => {
    if (!hasFinishedRef.current && !isFinished) {
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

      {/* 3. Story Content Box */}
      <div
        ref={contentTopRef}
        className="rounded-3xl p-6 sm:p-10 md:p-12 bg-white shadow-xs border border-slate-100 scroll-mt-24"
      >
        <div className="text-center pb-4 mb-8">
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
              storyId={story.id}
              hasQuiz={hasQuiz}
              isFinishing={isFinishing}
              isFinished={isFinished}
              onFinishStory={handleFinishStory}
              onNavigateToQuiz={handleNavigateToQuiz}
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
