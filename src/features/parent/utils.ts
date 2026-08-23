import { calculateAgeInArabic } from "@/lib/utils";
import type { ChildReportItem } from "./types";

/**
 * Derives child grade and age string (e.g. "الصف الثالث • 8 سنوات")
 */
export function getChildGradeAndAge(birthDateStr?: string): string {
  if (!birthDateStr) return "";
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) return "";

  const grades: Record<number, string> = {
    4: "الروضة",
    5: "الروضة",
    6: "الصف الأول",
    7: "الصف الثاني",
    8: "الصف الثالث",
    9: "الصف الرابع",
    10: "الصف الخامس",
    11: "الصف السادس",
    12: "الصف الأول الإعدادي",
    13: "الصف الثاني الإعدادي",
    14: "الصف الثالث الإعدادي",
    15: "الصف الأول الثانوي",
  };

  const ageStr = calculateAgeInArabic(birthDateStr);
  const gradeStr = grades[age];

  if (gradeStr && ageStr) {
    return `${gradeStr} • ${ageStr}`;
  }
  return gradeStr || ageStr || "";
}

/**
 * Formats relative activity time in Arabic
 */
export function formatArabicActivityTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "نشط الآن";
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 5) return "نشط الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  if (diffHours === 1) return "منذ ساعة";
  if (diffHours === 2) return "منذ ساعتين";
  if (diffHours < 24) return `منذ ${diffHours} ساعات`;
  if (diffDays === 1) return "منذ يوم";
  if (diffDays === 2) return "منذ يومين";
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;
  return `منذ ${diffDays} يوماً`;
}

/**
 * Calculates total minutes spent reading & solving quizzes
 */
export function calculateChildDurationMinutes(child: ChildReportItem): number {
  let totalSeconds = 0;
  if (Array.isArray(child.quiz_attempts) && child.quiz_attempts.length > 0) {
    totalSeconds += child.quiz_attempts.reduce(
      (acc, q) => acc + (Number(q.duration_seconds) || 0),
      0
    );
  }
  if (Array.isArray(child.reading_activities) && child.reading_activities.length > 0) {
    child.reading_activities.forEach((act) => {
      if (act.started_at && act.finished_at) {
        const start = new Date(act.started_at).getTime();
        const end = new Date(act.finished_at).getTime();
        if (!isNaN(start) && !isNaN(end) && end > start) {
          totalSeconds += Math.floor((end - start) / 1000);
        }
      }
    });
  }

  return Math.floor(totalSeconds / 60);
}

/**
 * Calculates level based on quizzes and reading progress
 */
export function getChildLevel(child: ChildReportItem): string {
  const storiesCount = Number(child.stories_read_count ?? child.reading_activities?.length ?? 0);
  const quizzesCount = Number(child.quizzes_count ?? child.quiz_attempts?.length ?? 0);
  const total = storiesCount + quizzesCount;

  if (total >= 10) return "المستوى الثالث";
  if (total >= 5) return "المستوى الثاني";
  return "المستوى الأول";
}

/**
 * Returns stories read count from child report item
 */
export function getChildStoriesCount(child: ChildReportItem): number {
  return Number(child.stories_read_count ?? child.reading_activities?.length ?? 0);
}

/**
 * Calculates average quiz results score percentage from child report item
 */
export function calculateChildAverageScore(child: ChildReportItem): number {
  if (child.average_score !== undefined && child.average_score !== null) {
    return Math.round(Number(child.average_score));
  }
  if (child.quiz_attempts && child.quiz_attempts.length > 0) {
    return Math.round(
      child.quiz_attempts.reduce((acc, q) => acc + (Number(q.score) || 0), 0) /
        child.quiz_attempts.length
    );
  }
  return 0;
}

/**
 * Returns badges count from child report item
 */
export function getChildBadgesCount(child: ChildReportItem): number {
  return Number(child.badges_count ?? child.user_badges?.length ?? 0);
}

/**
 * Returns quizzes count from child report item
 */
export function getChildQuizzesCount(child: ChildReportItem): number {
  return Number(child.quizzes_count ?? child.quiz_attempts?.length ?? 0);
}

/**
 * Returns rating label and Tailwind classes based on score percentage
 */
export function getScoreRating(score: number): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  if (score >= 90) {
    return {
      label: "مميز",
      bgClass: "bg-[#DCFCE7] border-[#BBF7D0]",
      textClass: "text-[#15803D]",
    };
  }
  if (score >= 80) {
    return {
      label: "جيد جداً",
      bgClass: "bg-[#F3E8FF] border-[#E9D5FF]",
      textClass: "text-[#7E22CE]",
    };
  }
  if (score >= 70) {
    return {
      label: "جيد",
      bgClass: "bg-[#F1F5F9] border-[#E2E8F0]",
      textClass: "text-[#475569]",
    };
  }
  if (score >= 50) {
    return {
      label: "مقبول",
      bgClass: "bg-[#FEF3C7] border-[#FDE68A]",
      textClass: "text-[#B45309]",
    };
  }
  return {
    label: "بحاجة لتحسين",
    bgClass: "bg-[#FFE4E6] border-[#FECDD3]",
    textClass: "text-[#BE123C]",
  };
}

/**
 * Formats date and time into standard Arabic string (e.g. "اليوم، 1:30 ص")
 */
export function formatArabicDateTime(dateStr?: string | null): string {
  if (!dateStr) return "اليوم، 1:30 ص";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "م" : "ص";
  const formattedHours = hours % 12 || 12;
  const timeStr = `${formattedHours}:${minutes} ${ampm}`;

  if (isToday) {
    return `اليوم، ${timeStr}`;
  }

  const days = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const dayName = days[date.getDay()];
  return `${dayName}، ${timeStr}`;
}

/**
 * Calculates reading activity duration in minutes
 */
export function calculateActivityDurationMinutes(
  startedAt?: string | null,
  finishedAt?: string | null
): number {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  return Math.max(1, Math.floor((end - start) / (1000 * 60)));
}



