"use client";

// ────────────────────────────────────────────────────────────────────────────
// Quiz Page — /stories/{storyId}/quiz
//
// Resolves:  params.id → story → story.quiz.id → <QuizView quizId={...} />
//
// IMPORTANT: Always uses story.quiz.id — NEVER story.id — for quiz API calls.
// ────────────────────────────────────────────────────────────────────────────

import React, { use } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import QuizLoading from "./loading";
import { useStoryById } from "@/features/story/hooks/useStoryById";
import { QuizView } from "@/features/quiz/components/QuizView";
import { getStoryQuizId } from "@/features/story/types";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { isFreeRole } from "@/lib/roles";
import { SelectChildPrompt } from "@/components/guards";

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const storyId = resolvedParams.id;

  const { data: storyResponse, isLoading, isPending, isError } = useStoryById(storyId);
  const story = storyResponse?.data;
  const quizId = getStoryQuizId(story);
  const {
    isAuthenticated,
    isParentRole,
    isParentActive,
    isFreeCustomer,
    sessionUserType,
    user_type,
    isLoading: isAccountLoading,
  } = useActiveAccount();

  const isFree =
    isFreeCustomer ||
    isFreeRole(sessionUserType) ||
    isFreeRole(user_type);

  const shouldPromptChildSelection =
    isAuthenticated && (isParentRole || isFree) && isParentActive;

  // Loading the story / auth state / query pending — show skeleton loading
  if (isLoading || isPending || isAccountLoading || (!story && !isError)) {
    return <QuizLoading />;
  }

  // Story not found or error (only after all loading is complete)
  if (isError || !story) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#4C1999] to-[#7939E3] px-4"
      >
        <AlertCircle className="w-12 h-12 text-white/70" />
        <p className="text-white font-bold text-center">
          لم نتمكن من العثور على القصة المطلوبة.
        </p>
        <Link
          href="/stories"
          className="py-2.5 px-7 rounded-full bg-white text-[#7939E3] font-bold text-sm"
        >
          العودة لمكتبة القصص
        </Link>
      </div>
    );
  }

  // Story found but has no quiz
  if (!quizId) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#4C1999] to-[#7939E3] px-4"
      >
        <AlertCircle className="w-12 h-12 text-white/70" />
        <p className="text-white font-bold text-center text-lg">
          لا يوجد اختبار لهذه القصة بعد.
        </p>
        <p className="text-white/70 text-sm font-semibold text-center">
          سيتم إضافة الاختبار قريباً، ابقَ متابعاً!
        </p>
        <Link
          href={`/stories/${storyId}`}
          className="py-2.5 px-7 rounded-full bg-white text-[#7939E3] font-bold text-sm"
        >
          العودة للقصة
        </Link>
      </div>
    );
  }

  // Parent Child Selection Prompt
  if (shouldPromptChildSelection) {
    return (
      <SelectChildPrompt
        actionType="quiz"
        storyId={story.id}
        storyTitle={story.title}
      />
    );
  }

  // Render the quiz — pass quizId to QuizView
  return (
    <QuizView
      quizId={quizId}
      storyId={story.id}
      storyTitle={story.title}
      storyLevel={story.level}
    />
  );
}


