"use client";

import React, { use } from "react";
import { StoryReaderView, StoryEmptyState } from "@/features/story";
import { useStoryById } from "@/features/story/hooks/useStoryById";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { SelectChildPrompt } from "@/components/guards";
import { Loader2 } from "lucide-react";

interface StoryReaderPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryReaderPage({ params }: StoryReaderPageProps) {
  const resolvedParams = use(params);
  const storyId = resolvedParams.id;

  const { isAuthenticated, isParentRole, isParentActive } = useActiveAccount();
  const shouldPromptChildSelection =
    isAuthenticated && isParentRole && isParentActive;

  const { data: storyResponse, isLoading, isError } = useStoryById(storyId);
  const story = storyResponse?.data;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Page Content */}
      <div className="flex-1 flex flex-col">
        {/* Loading State */}
        {isLoading && (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#7939E3]" />
            <p className="font-bold text-sm">جاري فتح القصة للقراءة...</p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!isLoading && (!story || isError) && (
          <div className="container mx-auto px-4 py-16">
            <StoryEmptyState
              title="لم نتمكن من العثور على محتوى القصة"
              buttonText="العودة للقصص"
              buttonHref="/stories"
            />
          </div>
        )}

        {/* Parent Child Selection Prompt */}
        {!isLoading && story && shouldPromptChildSelection && (
          <SelectChildPrompt
            actionType="read"
            storyId={story.id}
            storyTitle={story.title}
          />
        )}

        {/* Story Reader Component (Child / Student / Visitor or selected child) */}
        {!isLoading && story && !shouldPromptChildSelection && (
          <StoryReaderView story={story} />
        )}
      </div>
    </div>
  );
}

