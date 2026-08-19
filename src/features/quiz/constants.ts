// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — Constants
// ────────────────────────────────────────────────────────────────────────────

/** Default quiz duration in seconds (10 minutes) */
export const QUIZ_DURATION_SECONDS = 10 * 60;

/** Roles that support persistent quiz history */
export const ROLES_WITH_HISTORY = ["parent", "child", "student"] as const;

/** TanStack Query keys */
export const quizQueryKeys = {
  all: ["quiz"] as const,
  detail: (role: string, quizId: string) =>
    [...quizQueryKeys.all, "detail", role, quizId] as const,
  history: (role: string, quizId: string) =>
    [...quizQueryKeys.all, "history", role, quizId] as const,
};

/** localStorage key for the timer Zustand store */
export const QUIZ_TIMER_STORAGE_KEY = "madarik_quiz_timer";
