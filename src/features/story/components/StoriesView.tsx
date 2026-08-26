"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StoryHeroBanner } from "./StoryHeroBanner";
import { StoryFilters } from "./StoryFilters";
import { StoryEmptyState } from "./StoryEmptyState";
import { StorySearchBanner } from "./StorySearchBanner";
import { StoryLoadingState } from "./StoryLoadingState";
import { StoryGrid } from "./StoryGrid";
import { Story, StoryFilterType } from "../types";
import { useFreeStories } from "../hooks/useFreeStories";

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_STEP = 4;

export const StoriesView: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";

  const { data: storiesResponse, isLoading, isError } = useFreeStories({
    search: searchQuery || undefined,
  });

  const allStories = useMemo<Story[]>(() => {
    if (!storiesResponse) return [];
    if (Array.isArray(storiesResponse.data)) return storiesResponse.data;
    if (Array.isArray((storiesResponse as any)?.data?.data))
      return (storiesResponse as any).data.data;
    return [];
  }, [storiesResponse]);

  // Filter States
  const [activeTab, setActiveTab] = useState<StoryFilterType>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  // Extract unique age categories dynamically from API data
  const availableAges = useMemo(() => {
    const set = new Set<string>();
    allStories.forEach((s) => {
      if (s.age_category && s.age_category !== "0-0") {
        set.add(`${s.age_category} سنة`);
      }
    });
    return Array.from(set);
  }, [allStories]);

  // Extract unique levels dynamically from API data
  const availableLevels = useMemo(() => {
    const set = new Set<string>();
    allStories.forEach((s) => {
      const levelName =
        typeof s.level === "object" && s.level ? s.level.name : s.level;
      if (levelName) {
        set.add(levelName);
      }
    });
    return Array.from(set);
  }, [allStories]);

  // Handle Tab Switch
  const handleTabChange = (tab: StoryFilterType) => {
    setActiveTab(tab);
    setSelectedAge("all");
    setSelectedLevel("all");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Filtered stories based on tab, age, and level selection
  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      if (activeTab === "age" && selectedAge !== "all") {
        const storyAge = `${story.age_category} سنة`;
        return storyAge === selectedAge;
      }
      if (activeTab === "level" && selectedLevel !== "all") {
        const levelName =
          typeof story.level === "object" && story.level
            ? story.level.name
            : story.level;
        return levelName === selectedLevel;
      }
      return true;
    });
  }, [allStories, activeTab, selectedAge, selectedLevel]);

  const hasMore = visibleCount < filteredStories.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSelectedAge("all");
    setSelectedLevel("all");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    if (searchQuery) {
      router.push("/stories");
    }
  };

  const handleClearSearch = () => {
    router.push("/stories");
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50">
      {/* 1. Top Purple Hero Banner */}
      <StoryHeroBanner />

      {/* 2. Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 flex-1 flex flex-col items-center">
        {/* Active Search Query Pill */}
        <StorySearchBanner
          searchQuery={searchQuery}
          totalResults={allStories.length}
          isLoading={isLoading}
          onClearSearch={handleClearSearch}
        />

        {/* Filter Tabs & Chips */}
        <StoryFilters
          activeTab={activeTab}
          onTabChange={handleTabChange}
          availableAges={availableAges}
          selectedAge={selectedAge}
          onAgeChange={setSelectedAge}
          availableLevels={availableLevels}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
        />

        {/* Loading State */}
        {isLoading && <StoryLoadingState />}

        {/* Empty State */}
        {!isLoading && (filteredStories.length === 0 || isError) && (
          <StoryEmptyState
            title={
              searchQuery
                ? `لا توجد نتائج مطابقة للبحث "${searchQuery}"`
                : "لا توجد قصص متاحة"
            }
            buttonText={searchQuery ? "عرض جميع القصص" : "العودة للرئيسية"}
            buttonHref="/stories"
            onResetFilters={
              searchQuery ||
              activeTab !== "all" ||
              selectedAge !== "all" ||
              selectedLevel !== "all"
                ? handleResetFilters
                : undefined
            }
          />
        )}

        {/* Stories Grid */}
        {!isLoading && filteredStories.length > 0 && (
          <StoryGrid
            stories={filteredStories}
            visibleCount={visibleCount}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>
    </div>
  );
};

export default StoriesView;
