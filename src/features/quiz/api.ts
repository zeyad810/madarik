// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — API Layer (Unified Endpoints)
// All fetch logic is centralized here. Uses services/api.ts (no Axios).
//
// Unified endpoints (all roles share the same URL):
//   GET  /quiz/{id}
//   POST /quiz/{id}/check-answer
//   POST /quiz/{id}            (submit)
//   GET  /free/child/quiz-attempts  (free_customer history only)
//
// visitor / free_customer → result displayed, no history saved
// parent / child / student → full history saved by backend
// ────────────────────────────────────────────────────────────────────────────

import { API_BASE_URL, handleResponse } from "@/services/api";
import {
  QuizResponse,
  CheckAnswerPayload,
  CheckAnswerResponse,
  SubmitQuizPayload,
  SubmitQuizResponse,
  QuizHistoryResponse,
  QuizHistoryItem,
} from "./types";
import { getStoredAuthToken } from "@/lib/auth";

// ── Header builder ────────────────────────────────────────────────────────────

function buildHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const resolvedToken = token || getStoredAuthToken();
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

// ── Role helpers ──────────────────────────────────────────────────────────────

/**
 * Returns true for roles that should NOT persist history.
 * visitor  → unauthenticated
 * free / free_customer → show result only
 */
function isGuestRole(role: string): boolean {
  const r = (role || "").toLowerCase().trim();
  return ["visitor", "free", "free_customer", "freecustomer", "customer", "user", "public"].includes(r);
}

function isFreeRole(role: string): boolean {
  const r = (role || "").toLowerCase().trim();
  return ["free", "free_customer", "freecustomer", "customer", "user"].includes(r);
}

// ── GET /quiz/{id} ────────────────────────────────────────────────────────────

/**
 * Fetches the quiz by quiz ID.
 * Unified endpoint: GET /quiz/{id} (all roles)
 */
export const getQuiz = async (
  quizId: string,
  role: string = "visitor",
  token?: string | null
): Promise<QuizResponse> => {
  const endpoint = `${API_BASE_URL}/quiz/${quizId}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<QuizResponse>(response);
};

// ── POST /quiz/{id}/check-answer ──────────────────────────────────────────────

/**
 * Checks a single answer instantly.
 * Unified endpoint: POST /quiz/{id}/check-answer (all roles)
 */
export const checkQuizAnswer = async (
  quizId: string,
  role: string = "visitor",
  payload: CheckAnswerPayload,
  token?: string | null
): Promise<CheckAnswerResponse> => {
  const endpoint = `${API_BASE_URL}/quiz/${quizId}/check-answer`;

  const bodyData = {
    question_id: payload.question_id,
    answer: payload.answer,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(bodyData),
  });

  return await handleResponse<CheckAnswerResponse>(response);
};

// ── POST /quiz/{id} (Submit Quiz) ─────────────────────────────────────────────

/**
 * Submits the complete quiz with all answers.
 * Unified endpoint: POST /quiz/{id} (all roles)
 *
 * visitor / free_customer → backend shows result but does NOT save history
 * parent / child / student → backend saves history automatically
 */
export const submitQuiz = async (
  quizId: string,
  role: string = "visitor",
  payload: SubmitQuizPayload,
  token?: string | null,
  childId?: string | null
): Promise<SubmitQuizResponse> => {
  const endpoint = `${API_BASE_URL}/quiz/${quizId}`;
  const resolvedChildId = childId || getStoredActiveChildId();

  // Format answers map: { [question_id]: answer }
  let answersMap: Record<string, string> = {};
  if (Array.isArray(payload.answers)) {
    payload.answers.forEach((entry) => {
      if (entry && entry.question_id) {
        answersMap[entry.question_id] = entry.answer;
      }
    });
  } else if (payload.answers && typeof payload.answers === "object") {
    answersMap = { ...payload.answers };
  }

  const formattedBody: Record<string, any> = {
    started_at: payload.started_at || new Date().toISOString(),
    answers: answersMap,
  };

  // Only attach child/student ID for authenticated non-guest roles
  if (!isGuestRole(role) && resolvedChildId) {
    formattedBody.child_id = resolvedChildId;
    formattedBody.student_id = resolvedChildId;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(formattedBody),
  });

  return await handleResponse<SubmitQuizResponse>(response);
};

function getStoredActiveChildId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("madarik_active_account");
    if (raw) {
      const parsed = JSON.parse(raw);
      const id = parsed?.state?.activeAccountId;
      if (id && id !== "parent") {
        return id;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// ── GET Quiz History / Attempts ───────────────────────────────────────────────

/**
 * Fetches past quiz attempts.
 *
 * visitor       → empty (no history)
 * free_customer → GET /free/child/quiz-attempts
 * parent/child  → GET /parent/children/{id}/quiz-attempts  (existing behavior kept)
 * student       → GET /student/attempts-log                (existing behavior kept)
 *
 * NOTE: Only free_customer endpoint changed to the new unified path.
 * parent & student endpoints remain as-is since backend didn't change those.
 */
export const getQuizHistory = async (
  targetIdOrQuizId?: string | null,
  role: string = "visitor",
  token?: string | null
): Promise<QuizHistoryResponse> => {
  const r = (role || "").toLowerCase().trim();

  // Visitors and unauthenticated users get no history
  if (r === "visitor" || r === "public") {
    return { success: true, data: [] };
  }

  let childId = targetIdOrQuizId;
  if (!childId && (r === "parent" || r === "child" || isFreeRole(r))) {
    childId = getStoredActiveChildId();
  }

  let endpoint = "";
  if (r === "student") {
    endpoint = `${API_BASE_URL}/student/attempts-log`;
  } else if (r === "parent" || r === "child") {
    endpoint = childId
      ? `${API_BASE_URL}/parent/children/${childId}/quiz-attempts`
      : `${API_BASE_URL}/parent/child/quiz-attempts`;
  } else if (isFreeRole(r)) {
    // Unified endpoint for free_customer
    endpoint = `${API_BASE_URL}/free/child/quiz-attempts`;
  } else {
    // Fallback for any other authenticated role
    endpoint = `${API_BASE_URL}/student/attempts-log`;
  }

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: buildHeaders(token),
    });

    const raw = await handleResponse<any>(response);

    let rawList: any[] = [];
    if (Array.isArray(raw?.data?.data)) {
      rawList = raw.data.data;
    } else if (Array.isArray(raw?.data)) {
      rawList = raw.data;
    } else if (Array.isArray(raw)) {
      rawList = raw;
    } else if (raw?.data && typeof raw.data === "object") {
      rawList = [raw.data];
    }

    // Deduplicate by story / quiz id so each story appears ONCE in history
    const uniqueMap = new Map<string, QuizHistoryItem>();

    rawList.forEach((obj: any, idx: number) => {
      if (!obj) return;
      const key = obj.id || obj.code || obj.story_title || obj.title || `item-${idx}`;

      const totalQ = obj.total_questions ?? obj.questions?.length ?? 1;
      const score = obj.score ?? obj.correct_answers ?? obj.last_score ?? 0;
      const lastScore = obj.last_score ?? score;
      const highestScore = obj.highest_score ?? score;
      const attemptsCount =
        obj.attempts_count ??
        obj.total_attempts ??
        obj.attempts_total ??
        obj.attempt_count ??
        obj.count ??
        (Array.isArray(obj.attempts) ? obj.attempts.length : undefined) ??
        (Array.isArray(obj.quiz_attempts) ? obj.quiz_attempts.length : undefined) ??
        (Array.isArray(obj.history) ? obj.history.length : undefined) ??
        obj.attempt_number ??
        1;

      const normalized: QuizHistoryItem = {
        id: obj.id || `quiz-${idx}`,
        quiz_id: obj.quiz_id || obj.id,
        story_id: obj.story_id,
        story_title: obj.story_title || obj.title || obj.story?.title || "اختبار القصة",
        code: obj.code,
        level: obj.level || obj.story?.level || "المستوى 3",
        outcome: obj.outcome || obj.story?.outcome || "يفهم القصة",
        indicator: obj.indicator || obj.story?.indicator || "يحلل الأحداث",
        passing_score: obj.passing_score ?? 60,
        total_questions: totalQ,
        score: score,
        percentage: obj.percentage ?? Math.round(((highestScore || score) / (totalQ || 1)) * 100),
        passed: obj.passed ?? ((highestScore || score) >= (obj.passing_score ?? 60)),
        attempts_count: attemptsCount,
        attempt_number: attemptsCount,
        last_score: lastScore,
        highest_score: highestScore,
        max_score: 100,
        created_at: obj.created_at || obj.updated_at || new Date().toISOString(),
        questions: obj.questions || [],
        ...obj,
      };

      uniqueMap.set(key, normalized);
    });

    const list = Array.from(uniqueMap.values());

    return {
      success: raw?.success ?? true,
      message: raw?.message,
      data: list,
      raw: raw?.data,
    };
  } catch (error) {
    return {
      success: true,
      data: [],
    };
  }
};
