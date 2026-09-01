// ────────────────────────────────────────────────────────────────────────────
// Quiz Timer Store — Zustand + localStorage persistence
//
// Stores an absolute expiration timestamp (expiresAt) rather than remaining
// seconds so that timer state survives browser refreshes and tab changes.
// Follows the same pattern as store/useAccountStore.ts.
// ────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { QUIZ_TIMER_STORAGE_KEY } from "../constants";

interface QuizTimerState {
  /** The quiz ID this timer belongs to (null when no active quiz) */
  quizId: string | null;
  /** Absolute Unix timestamp in ms when the quiz was started */
  startTime: number | null;

  setTimer: (quizId: string, startTime: number) => void;
  clearTimer: () => void;
}

export const useQuizTimerStore = create<QuizTimerState>()(
  persist(
    (set) => ({
      quizId: null,
      startTime: null,

      setTimer: (quizId, startTime) => set({ quizId, startTime }),
      clearTimer: () => set({ quizId: null, startTime: null }),
    }),
    {
      name: QUIZ_TIMER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
