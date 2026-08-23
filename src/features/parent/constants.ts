import { QuizResultRow, ReadingHistoryRow } from "./types";

export const parentQueryKeys = {
  all: ["parent"] as const,
  children: () => [...parentQueryKeys.all, "children"] as const,
  reports: () => [...parentQueryKeys.all, "reports"] as const,
};

/**
 * Sample fallback quiz items when child has no quiz attempts recorded yet
 */
export const DEFAULT_QUIZ_ROWS: QuizResultRow[] = [
  {
    id: "q1",
    storyTitle: "الفيل الصغير الطائر",
    level: "المستوى الثالث",
    resultScore: 95,
    attemptsCount: 1,
    lastScore: 65,
    highestScore: 42,
    maxScore: 100,
  },
  {
    id: "q2",
    storyTitle: "مغامرة في الغابة السحرية",
    level: "المستوى الثالث",
    resultScore: 95,
    attemptsCount: 2,
    lastScore: 65,
    highestScore: 42,
    maxScore: 100,
  },
  {
    id: "q3",
    storyTitle: "رحلة إلى القصر الغامض",
    level: "المستوى الثاني",
    resultScore: 95,
    attemptsCount: 3,
    lastScore: 65,
    highestScore: 42,
    maxScore: 100,
  },
  {
    id: "q4",
    storyTitle: "الأرنب الذكي والأسد",
    level: "المستوى الثالث",
    resultScore: 95,
    attemptsCount: 5,
    lastScore: 65,
    highestScore: 42,
    maxScore: 100,
  },
  {
    id: "q5",
    storyTitle: "سر الصندوق الذهبي القديم",
    level: "المستوى الأول",
    resultScore: 95,
    attemptsCount: 2,
    lastScore: 65,
    highestScore: 42,
    maxScore: 100,
  },
  {
    id: "q6",
    storyTitle: "بطل الحكايات الشجاع",
    level: "المستوى الثاني",
    resultScore: 95,
    attemptsCount: 2,
    lastScore: 65,
    highestScore: 42,
    maxScore: 100,
  },
];

/**
 * Sample fallback reading items when child has no reading activities recorded yet
 */
export const DEFAULT_READING_ROWS: ReadingHistoryRow[] = [
  {
    id: "r1",
    storyTitle: "الفيل الصغير الطائر",
    dateText: "اليوم، 1:30 ص",
    durationMinutes: 15,
    status: "completed",
  },
  {
    id: "r2",
    storyTitle: "الفيل الصغير الطائر",
    dateText: "اليوم، 1:30 ص",
    durationMinutes: 15,
    status: "completed",
  },
  {
    id: "r3",
    storyTitle: "الفيل الصغير الطائر",
    dateText: "اليوم، 1:30 ص",
    durationMinutes: 15,
    status: "completed",
  },
  {
    id: "r4",
    storyTitle: "الفيل الصغير الطائر",
    dateText: "اليوم، 1:30 ص",
    durationMinutes: 15,
    status: "in_progress",
  },
  {
    id: "r5",
    storyTitle: "الفيل الصغير الطائر",
    dateText: "اليوم، 1:30 ص",
    durationMinutes: 15,
    status: "completed",
  },
];

