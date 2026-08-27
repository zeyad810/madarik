// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — Types
// ────────────────────────────────────────────────────────────────────────────

export type QuizQuestionType = "mcq" | "tf" | "true_false" | string;

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
  started_at?: string;
  answers: Record<string, string> | QuizAnswerEntry[];
}

export interface SubmitResultAnswerItem {
  question_id: string;
  question_text?: string;
  your_answer?: string | null;
  correct_answer?: string;
  is_correct?: boolean;
}

export interface QuizResultData {
  score: number;
  points_earned?: number;
  highest_score?: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers?: number;
  duration_seconds?: number;
  percentage?: number;
  passed: boolean;
  passing_score?: number;
  time_taken?: number;
  badges_earned?: string[];
  answers?: SubmitResultAnswerItem[];
}

export interface SubmitQuizResponse {
  success: boolean;
  message?: string;
  data: QuizResultData;
}

// ── History / Attempts ────────────────────────────────────────────────────────

export interface QuizHistoryItem {
  id: string;
  quiz_id?: string;
  story_id?: string;
  story_title?: string;
  level_name?: string;
  outcome_name?: string;
  indicator_name?: string;
  story?: {
    id: string;
    title: string;
    level?: string | { id: string; name: string };
    outcome?: string;
    indicator?: string;
  };
  level?: string;
  outcome?: string;
  indicator?: string;
  code?: string;
  questions?: any[];
  score: number;
  total_questions: number;
  percentage?: number;
  passed?: boolean;
  passing_score?: number;
  attempts_count?: number;
  attempt_number?: number;
  last_score?: number;
  highest_score?: number;
  last_score_percentage?: number;
  highest_score_percentage?: number;
  passing_score_percentage?: number;
  highest_score_emoji?: string;
  max_score?: number | string;
  last_attempt_at?: string;
  created_at: string;
}

export interface QuizHistoryResponse {
  success: boolean;
  message?: string;
  data: QuizHistoryItem[];
  raw?: any;
}

// ── Local State Shapes ────────────────────────────────────────────────────────

export interface AnswerCheckResult {
  isCorrect: boolean;
  correctAnswer?: string;
}

export type CheckedAnswersMap = Record<string, AnswerCheckResult>;
export type SelectedAnswersMap = Record<string, string>;
export type SubmissionState = "idle" | "submitting" | "submitted";

