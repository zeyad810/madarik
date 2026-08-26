import React, { Suspense } from "react";
import type { Metadata } from "next";
import { StoriesView } from "@/features/story/components/StoriesView";
import { StoryLoadingState } from "@/features/story/components/StoryLoadingState";

export const metadata: Metadata = {
  title: "المكتبة والقصص التفاعلية | مدارك القراءة",
  description:
    "تصفح واقرأ أجمل القصص التعليمية التفاعلية للأطفال على منصة مدارك القراءة.",
};

export default function StoriesPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50/50">
      <Suspense fallback={<StoryLoadingState message="جاري تحميل صفحة القصص..." />}>
        <StoriesView />
      </Suspense>
    </main>
  );
}
