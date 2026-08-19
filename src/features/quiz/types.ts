// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — Types
// ────────────────────────────────────────────────────────────────────────────

export type QuizQuestionType = "mcq" | "true_false" | string;

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question_text: string;
  options: string[];
  order: number;
}

export interface Quiz {
  id: string;
  code: string;
  story_title: string;
  passing_score: number;
  total_questions: number;
  questions: QuizQuestion[];
  /** Optional duration in seconds returned by some endpoints */
  duration_seconds?: number;
}

export interface QuizResponse {
  success: boolean;
  data: Quiz;
}

// ── Check Answer ──────────────────────────────────────────────────────────────

export interface CheckAnswerPayload {
  question_id: string;
  answer: string;
}

export interface CheckAnswerData {
  is_correct: boolean;
  correct_answer?: string;
  points?: number;
}

export interface CheckAnswerResponse {
  success: boolean;
  data: CheckAnswerData;
}

// ── Submit Quiz ───────────────────────────────────────────────────────────────

export interface QuizAnswerEntry {
  question_id: string;
  answer: string;
}

export interface SubmitQuizPayload {
  answers: QuizAnswerEntry[];
}

export interface QuizResultData {
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers?: number;
  percentage?: number;
  passed: boolean;
  passing_score?: number;
  time_taken?: number;
}

export interface SubmitQuizResponse {
  success: boolean;
  data: QuizResultData;
}

// ── History ───────────────────────────────────────────────────────────────────

export interface QuizHistoryItem {
  id: string;
  quiz_id: string;
  story_title?: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  passing_score: number;
  attempt_number?: number;
  created_at: string;
}

export interface QuizHistoryResponse {
  success: boolean;
  data: QuizHistoryItem[];
}

// ── Local State Shapes ────────────────────────────────────────────────────────

export interface AnswerCheckResult {
  isCorrect: boolean;
  correctAnswer?: string;
}

export type CheckedAnswersMap = Record<string, AnswerCheckResult>;
export type SelectedAnswersMap = Record<string, string>;
export type SubmissionState = "idle" | "submitting" | "submitted";
