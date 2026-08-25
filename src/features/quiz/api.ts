// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — API Layer
// All fetch logic is centralized here. Uses services/api.ts (no Axios).
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
import { getQuizApiPrefix } from "./utils";
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

// ── GET Quiz ──────────────────────────────────────────────────────────────────

/**
 * Fetches the quiz by quiz ID with user role and authentication header.
 * - visitor:        GET public/quiz/{id}
 * - free_customer:  GET free/quiz/{id}
 * - parent / child: GET parent/quiz/{id}
 * - student:        GET student/quiz/{id}
 */
export const getQuiz = async (
  quizId: string,
  role: string = "visitor",
  token?: string | null
): Promise<QuizResponse> => {
  const prefix = getQuizApiPrefix(role);
  const endpoint = `${API_BASE_URL}/${prefix}/quiz/${quizId}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: buildHeaders(token),
    });

    return await handleResponse<QuizResponse>(response);
  } catch (error) {
    // If role-specific endpoint 404s, gracefully fallback to public quiz
    if (prefix !== "public") {
      try {
        const fallbackResponse = await fetch(
          `${API_BASE_URL}/public/quiz/${quizId}`,
          {
            method: "GET",
            headers: buildHeaders(token),
          }
        );
        return await handleResponse<QuizResponse>(fallbackResponse);
      } catch {
        // rethrow original error
      }
    }
    throw error;
  }
};

// ── POST Check Answer ─────────────────────────────────────────────────────────

/**
 * Checks a single answer instantly at the moment of selection.
 * - visitor:        POST public/quiz/{id}/check-answer
 * - free_customer:  POST quiz/{id}/check-answer (fallback: free/quiz/{id}/check-answer)
 * - parent / child: POST parent/quiz/{id}/check-answer
 * - student:        POST student/quiz/{id}/check-answer
 */
export const checkQuizAnswer = async (
  quizId: string,
  role: string = "visitor",
  payload: CheckAnswerPayload,
  token?: string | null
): Promise<CheckAnswerResponse> => {
  const prefix = getQuizApiPrefix(role);
  let endpoint = `${API_BASE_URL}/${prefix}/quiz/${quizId}/check-answer`;

  if (prefix === "free") {
    // user specified POST quiz/{id}/check-answer for free customer
    endpoint = `${API_BASE_URL}/quiz/${quizId}/check-answer`;
  }

  const bodyData = {
    question_id: payload.question_id,
    answer: payload.answer,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(bodyData),
    });

    return await handleResponse<CheckAnswerResponse>(response);
  } catch (error) {
    // For free_customer, try fallback to free/quiz/{id}/check-answer or public
    if (prefix === "free") {
      try {
        const altResponse = await fetch(
          `${API_BASE_URL}/free/quiz/${quizId}/check-answer`,
          {
            method: "POST",
            headers: buildHeaders(token),
            body: JSON.stringify(bodyData),
          }
        );
        return await handleResponse<CheckAnswerResponse>(altResponse);
      } catch {
        // ignore
      }
    }

    // Fallback to public check-answer
    if (prefix !== "public") {
      try {
        const pubResponse = await fetch(
          `${API_BASE_URL}/public/quiz/${quizId}/check-answer`,
          {
            method: "POST",
            headers: buildHeaders(token),
            body: JSON.stringify(bodyData),
          }
        );
        return await handleResponse<CheckAnswerResponse>(pubResponse);
      } catch {
        // ignore
      }
    }

    throw error;
  }
};

// ── Local Attempts Persistence Helpers ───────────────────────────────────────

export const LOCAL_ATTEMPTS_KEY = "madarik_quiz_attempts";

export function saveQuizAttemptLocally(
  childId: string | null | undefined,
  attempt: QuizHistoryItem
): void {
  if (typeof window === "undefined") return;
  try {
    const key = childId ? `${LOCAL_ATTEMPTS_KEY}_${childId}` : LOCAL_ATTEMPTS_KEY;
    const existingRaw = localStorage.getItem(key);
    const existingList: QuizHistoryItem[] = existingRaw ? JSON.parse(existingRaw) : [];

    // Filter out if same id or same quiz on the same timestamp
    const filtered = existingList.filter(
      (x) => x.id !== attempt.id && !(x.quiz_id === attempt.quiz_id && x.created_at === attempt.created_at)
    );
    const updated = [attempt, ...filtered];
    localStorage.setItem(key, JSON.stringify(updated));

    // Also update global recent list
    const globalRaw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    const globalList: QuizHistoryItem[] = globalRaw ? JSON.parse(globalRaw) : [];
    const globalFiltered = globalList.filter((x) => x.id !== attempt.id);
    localStorage.setItem(
      LOCAL_ATTEMPTS_KEY,
      JSON.stringify([attempt, ...globalFiltered].slice(0, 30))
    );
  } catch {
    // ignore
  }
}

export function getLocalQuizAttempts(childId?: string | null): QuizHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const key = childId ? `${LOCAL_ATTEMPTS_KEY}_${childId}` : LOCAL_ATTEMPTS_KEY;
    const raw = localStorage.getItem(key) || localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

// ── POST Submit Quiz ──────────────────────────────────────────────────────────

/**
 * Submits the complete quiz with all answers and returns detailed statistics.
 * - visitor:        POST public/quiz/{id}
 * - free_customer:  POST free/quiz/{id}
 * - parent / child: POST parent/quiz/{id}
 * - student:        POST student/quiz/{id}
 */
export const submitQuiz = async (
  quizId: string,
  role: string = "visitor",
  payload: SubmitQuizPayload,
  token?: string | null,
  childId?: string | null
): Promise<SubmitQuizResponse> => {
  const prefix = getQuizApiPrefix(role);
  const endpoint = `${API_BASE_URL}/${prefix}/quiz/${quizId}`;
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

  if (resolvedChildId) {
    formattedBody.child_id = resolvedChildId;
    formattedBody.student_id = resolvedChildId;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(formattedBody),
    });

    return await handleResponse<SubmitQuizResponse>(response);
  } catch (error) {
    if (prefix !== "public") {
      try {
        const pubResponse = await fetch(
          `${API_BASE_URL}/public/quiz/${quizId}`,
          {
            method: "POST",
            headers: buildHeaders(token),
            body: JSON.stringify(formattedBody),
          }
        );
        return await handleResponse<SubmitQuizResponse>(pubResponse);
      } catch {
        // ignore
      }
    }
    throw error;
  }
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
 * Fetches past quiz attempts for the authenticated role.
 * - student:        GET student/attempts-log
 * - parent / child: GET parent/children/{id}/quiz-attempts (using active child ID)
 * - free_customer:  GET free/child/quiz-attempts
 * - visitor:        returns empty (no history)
 */
export const getQuizHistory = async (
  targetIdOrQuizId?: string | null,
  role: string = "visitor",
  token?: string | null
): Promise<QuizHistoryResponse> => {
  const prefix = getQuizApiPrefix(role);

  if (prefix === "public") {
    return { success: true, data: [] };
  }

  let childId = targetIdOrQuizId;
  if (!childId && (prefix === "parent" || prefix === "free" || role === "child")) {
    childId = getStoredActiveChildId();
  }

  const localAttempts = getLocalQuizAttempts(childId);

  let endpoint = "";
  if (prefix === "student") {
    endpoint = `${API_BASE_URL}/student/attempts-log`;
  } else if (prefix === "parent" || role === "child") {
    endpoint = childId
      ? `${API_BASE_URL}/parent/children/${childId}/quiz-attempts`
      : `${API_BASE_URL}/parent/child/quiz-attempts`;
  } else if (prefix === "free") {
    endpoint = `${API_BASE_URL}/free/child/quiz-attempts`;
  } else {
    endpoint = `${API_BASE_URL}/${prefix}/attempts-log`;
  }

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: buildHeaders(token),
    });

    const raw = await handleResponse<any>(response);

    let list: any[] = [];
    if (Array.isArray(raw?.data?.data)) {
      list = raw.data.data;
    } else if (Array.isArray(raw?.data)) {
      list = raw.data;
    } else if (Array.isArray(raw)) {
      list = raw;
    } else if (raw?.data && typeof raw.data === "object") {
      // Single quiz attempts / history object
      list = [
        {
          id: raw.data.id || `att-${Date.now()}`,
          story_title: raw.data.story_title || raw.data.title || "اختبار القصة",
          code: raw.data.code,
          passing_score: raw.data.passing_score ?? 60,
          total_questions: raw.data.total_questions ?? raw.data.questions?.length ?? 0,
          score: raw.data.score ?? raw.data.correct_answers ?? raw.data.total_questions ?? 0,
          percentage: raw.data.percentage ?? (raw.data.passing_score ? raw.data.passing_score : 100),
          passed: raw.data.passed ?? true,
          attempts_count: raw.data.attempts_count ?? 1,
          highest_score: raw.data.highest_score ?? raw.data.score,
          last_score: raw.data.last_score ?? raw.data.score,
          created_at: raw.data.created_at || new Date().toISOString(),
          questions: raw.data.questions || [],
          ...raw.data,
        },
      ];
    }

    // Merge API attempts with local attempts so newly solved quizzes show up immediately!
    const combinedMap = new Map<string, QuizHistoryItem>();

    // Add local attempts first
    localAttempts.forEach((item) => {
      if (item && (item.id || item.story_title)) {
        combinedMap.set(item.id || item.story_title || Math.random().toString(), item);
      }
    });

    // Overwrite/add with API attempts
    list.forEach((item) => {
      if (item && (item.id || item.story_title)) {
        combinedMap.set(item.id || item.story_title || Math.random().toString(), item);
      }
    });

    const combinedList = Array.from(combinedMap.values());

    return {
      success: raw?.success ?? true,
      message: raw?.message,
      data: combinedList.length > 0 ? combinedList : list,
      raw: raw?.data,
    };
  } catch (error) {
    return {
      success: true,
      data: localAttempts,
    };
  }
};

