// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — Public API
// ────────────────────────────────────────────────────────────────────────────

export * from "./types";
export * from "./api";
export * from "./constants";
export * from "./utils";

// Hooks
export * from "./hooks/useQuiz";
export * from "./hooks/useCheckQuizAnswer";
export * from "./hooks/useSubmitQuiz";
export * from "./hooks/useQuizHistory";

// Store
export * from "./store/useQuizTimerStore";

// Components — named to avoid collision with types (QuizQuestion type vs component)
export { QuizView } from "./components/QuizView";
export { QuizTimer } from "./components/QuizTimer";
export { QuizQuestion as QuizQuestionView } from "./components/QuizQuestion";
export { QuizOption } from "./components/QuizOption";
export { AttemptsLogView } from "./components/AttemptsLogView";


