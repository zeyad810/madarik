"use client";

import React, { use } from "react";
import {
  StoryDetailHero,
  SuggestedStories,
  StoryEmptyState,
} from "@/features/story";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import { useStoryById } from "@/features/story/hooks/useStoryById";
import { useFreeStories } from "@/features/story/hooks/useFreeStories";
import { Loader2 } from "lucide-react";

interface StoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const resolvedParams = use(params);
  const storyId = resolvedParams.id;

  const { data: storyResponse, isLoading, isError } = useStoryById(storyId);
  const { data: allStoriesResponse } = useFreeStories();

  const story = storyResponse?.data;
  const allStories = allStoriesResponse?.data ?? [];

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50">
      {/* Page Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 flex-1 flex flex-col">
        {/* Loading State */}
        {isLoading && (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#7939E3]" />
            <p className="font-bold text-sm">جاري تحميل تفاصيل القصة...</p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!isLoading && (!story || isError) && (
          <StoryEmptyState
            title="لم نتمكن من العثور على هذه القصة"
            buttonText="العودة للقصص"
            buttonHref="/stories"
          />
        )}

        {/* Story Details & Suggested Stories */}
        {!isLoading && story && (
          <>
            {/* Breadcrumb */}
            <div className="mb-6">
              <AutoBreadcrumbs dynamicLabels={{ [story.id]: story.title }} />
            </div>

            {/* Top Banner & Overview Card */}
            <StoryDetailHero story={story} />

            {/* Suggested Stories Section */}
            <SuggestedStories
              stories={allStories}
              currentStoryId={story.id}
              className="mt-12"
            />
          </>
        )}
      </div>
    </div>
  );
}
