"use client";

import React, { useMemo } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useChildReport } from "../hooks";
import {
  getChildGradeAndAge,
  getChildLevel,
  calculateChildAverageScore,
  getChildStoriesCount,
  getChildQuizzesCount,
  formatArabicActivityTime,
  formatArabicDateTime,
  calculateActivityDurationMinutes,
} from "../utils";
import { ChildReportSummaryCard } from "./ChildReportSummaryCard";
import { ChildReportStats } from "./ChildReportStats";
import { ChildQuizResultsTable } from "./ChildQuizResultsTable";
import { ChildReadingHistory } from "./ChildReadingHistory";
import { ChildReportDetailSkeleton } from "@/components/ui/skeletons";

interface ChildReportProps {
  childId: string;
}

export const ChildReport: React.FC<ChildReportProps> = ({ childId }) => {
  const { child, isLoading } = useChildReport(childId);

  const storiesCount = child ? getChildStoriesCount(child) : 0;
  const quizzesCount = child ? getChildQuizzesCount(child) : 0;
  const averageScore = child ? calculateChildAverageScore(child) : 0;
  const gradeAndAge = child?.birth_date ? getChildGradeAndAge(child.birth_date) : "";
  const levelText = child ? getChildLevel(child) : "";
  const activityTime = child?.updated_at
    ? formatArabicActivityTime(child.updated_at)
    : child
    ? "نشط"
    : "";

  // Build Quiz rows from child data or empty array
  const quizRows = useMemo(() => {
    if (child?.quiz_attempts && child.quiz_attempts.length > 0) {
      return child.quiz_attempts.map((attempt, index) => {
        const score = Number(attempt.score) || 0;

        // Resolve story title from quiz or reading activities
        const matchedReadingStory = child.reading_activities?.find(
          (act) =>
            (attempt.quiz?.story_id && act.story_id === attempt.quiz.story_id) ||
            (attempt.quiz?.story_id && act.story?.id === attempt.quiz.story_id)
        )?.story;

        const resolvedTitle =
          attempt.story?.title ||
          attempt.quiz?.story?.title ||
          attempt.quiz?.title ||
          matchedReadingStory?.title ||
          (attempt.quiz?.code ? `اختبار ${attempt.quiz.code}` : `اختبار القصة ${index + 1}`);

        const resolvedStory = attempt.story ||
          attempt.quiz?.story ||
          matchedReadingStory || {
            id: attempt.quiz?.story_id || `story-${index}`,
            title: resolvedTitle,
          };

        return {
          id: attempt.id || `quiz-${index}`,
          storyTitle: resolvedTitle,
          story: resolvedStory,
          level: levelText,
          resultScore: score,
          attemptsCount: attempt.attempt_number || attempt.total_count || 1,
          lastScore: score,
          highestScore: Number(attempt.highest_score) || score,
          maxScore: 100,
        };
      });
    }
    return [];
  }, [child, levelText]);

  // Build Reading history rows from child data or empty array
  const readingRows = useMemo(() => {
    if (child?.reading_activities && child.reading_activities.length > 0) {
      return child.reading_activities.slice(0, 5).map((act, index) => {
        const duration = calculateActivityDurationMinutes(
          act.started_at,
          act.finished_at
        );
        const resolvedTitle = act.story?.title || `قصة ${index + 1}`;

        return {
          id: act.id || `read-${index}`,
          storyTitle: resolvedTitle,
          story: act.story || { id: act.story_id, title: resolvedTitle },
          dateText: formatArabicDateTime(act.started_at),
          durationMinutes: duration,
          status: act.finished_at ? ("completed" as const) : ("in_progress" as const),
        };
      });
    }
    return [];
  }, [child]);

  const handleExport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return <ChildReportDetailSkeleton />;
  }

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-20!" dir="rtl">
      <div className="container mx-auto space-y-6">
        {/* 1. Breadcrumbs Navigation */}
        <div className="flex items-center justify-start">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/"
                  className="text-mad-text-secondary hover:text-mad-main font-medium"
                >
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/parents/childReports"
                  className="text-mad-text-secondary hover:text-mad-main font-medium"
                >
                  تقارير الأطفال
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-mad-main font-bold">
                  نتائج الطفل
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* 2. Page Header */}
        <div className="pt-1 pb-2 space-y-1 text-right">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-mad-text-primary tracking-tight">
            تقارير الأطفال
          </h1>
          <p className="text-xs sm:text-sm text-mad-text-secondary font-normal max-w-xl">
            شاهد وقم بإدارة حسابات أطفالك، وتابع تقدمهم القرائي واختباراتهم بكل سهولة.
          </p>
        </div>

        {/* 3. Child Profile Summary Card */}
        <ChildReportSummaryCard
          name={child?.name || ""}
          avatarUrl={child?.avatar_img || child?.avatar}
          gender={child?.gender}
          gradeAndAge={gradeAndAge}
          levelText={levelText}
          status={child?.status || "active"}
          isActive={child ? child.status === "active" : true}
        />

        {/* 4. Summary Stat Metric Cards */}
        <ChildReportStats
          storiesCount={storiesCount}
          quizzesCount={quizzesCount}
          averageScore={averageScore}
        />

        {/* 5. Quiz Results & Evaluation Table */}
        <ChildQuizResultsTable
          quizRows={quizRows}
          onExport={handleExport}
        />

        {/* 6. Reading History */}
        <ChildReadingHistory readingRows={readingRows} />
      </div>
    </div>
  );
};

export default ChildReport;