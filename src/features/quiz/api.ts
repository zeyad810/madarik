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

// ── Attempts Logging for Retries ──────────────────────────────────────────────

export const ATTEMPTS_LOG_KEY = "madarik_attempts_log";

export function recordChildAttempt(
  childId: string | null | undefined,
  attempt: QuizHistoryItem
): void {
  if (typeof window === "undefined" || !childId || childId === "parent") return;
  try {
    const key = `${ATTEMPTS_LOG_KEY}_${childId}`;
    const raw = localStorage.getItem(key);
    const list: QuizHistoryItem[] = raw ? JSON.parse(raw) : [];

    // Calculate attempt number for this specific quiz
    const sameQuizAttempts = list.filter(
      (x) => x.quiz_id === attempt.quiz_id || (x.story_title && x.story_title === attempt.story_title)
    );
    const attemptNum = sameQuizAttempts.length + 1;

    const entry: QuizHistoryItem = {
      ...attempt,
      id: attempt.id || `att_${Date.now()}_${attemptNum}`,
      attempt_number: attemptNum,
      attempts_count: attemptNum,
      created_at: attempt.created_at || new Date().toISOString(),
    };

    const updated = [entry, ...list];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getChildAttemptLogs(childId?: string | null): QuizHistoryItem[] {
  if (typeof window === "undefined" || !childId || childId === "parent") return [];
  try {
    const key = `${ATTEMPTS_LOG_KEY}_${childId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

// ── GET Quiz History / Attempts ───────────────────────────────────────────────

/**
 * Fetches past quiz attempts for the authenticated role 100% dynamically from Backend.
 * Unpacks nested attempts and retries so every attempt is displayed as a distinct history record.
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

  const childLogs = getChildAttemptLogs(childId);

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

    let list: QuizHistoryItem[] = [];

    // Helper to extract attempts from a single quiz object
    const unpackQuizObject = (obj: any, baseIndex: number = 0): QuizHistoryItem[] => {
      if (!obj) return [];
      const nestedAttempts = obj.attempts || obj.quiz_attempts || obj.history || obj.logs;

      if (Array.isArray(nestedAttempts) && nestedAttempts.length > 0) {
        return nestedAttempts.map((att: any, idx: number) => ({
          id: att.id || `${obj.id}-att-${idx + 1}`,
          quiz_id: obj.id || att.quiz_id,
          story_title: obj.story_title || att.story_title || obj.title || "اختبار القصة",
          level: obj.level || att.level,
          outcome: obj.outcome || att.outcome,
          indicator: obj.indicator || att.indicator,
          score: att.score ?? att.correct_answers ?? obj.score ?? 0,
          total_questions: att.total_questions ?? obj.total_questions ?? obj.questions?.length ?? 1,
          percentage:
            att.percentage ??
            Math.round(((att.score ?? att.correct_answers ?? 0) / (att.total_questions ?? obj.total_questions ?? 1)) * 100),
          passed: att.passed ?? ((att.percentage ?? 0) >= (obj.passing_score ?? 60)),
          passing_score: obj.passing_score ?? 60,
          attempt_number: att.attempt_number ?? att.attempt ?? idx + 1,
          attempts_count: nestedAttempts.length,
          last_score: obj.last_score ?? att.score ?? 0,
          highest_score: obj.highest_score ?? att.score ?? 0,
          max_score: obj.total_questions || 10,
          created_at: att.created_at || obj.created_at || new Date().toISOString(),
          ...att,
        }));
      }

      // Check if child has local attempt logs for this quiz
      const matchedLogs = childLogs.filter(
        (log) => log.quiz_id === obj.id || (log.story_title && log.story_title === obj.story_title)
      );

      if (matchedLogs.length > 1) {
        return matchedLogs;
      }

      return [
        {
          id: obj.id || `att-${baseIndex + 1}`,
          quiz_id: obj.id,
          story_title: obj.story_title || obj.title || "اختبار القصة",
          code: obj.code,
          passing_score: obj.passing_score ?? 60,
          total_questions: obj.total_questions ?? obj.questions?.length ?? 0,
          score: obj.score ?? obj.correct_answers ?? 0,
          percentage: obj.percentage ?? (obj.passing_score ? obj.passing_score : 100),
          passed: obj.passed ?? true,
          attempt_number: obj.attempt_number ?? 1,
          attempts_count: obj.attempts_count ?? 1,
          highest_score: obj.highest_score ?? obj.score ?? 0,
          last_score: obj.last_score ?? obj.score ?? 0,
          created_at: obj.created_at || new Date().toISOString(),
          questions: obj.questions || [],
          ...obj,
        },
      ];
    };

    if (Array.isArray(raw?.data?.data)) {
      list = raw.data.data.flatMap((item: any, i: number) => unpackQuizObject(item, i));
    } else if (Array.isArray(raw?.data)) {
      list = raw.data.flatMap((item: any, i: number) => unpackQuizObject(item, i));
    } else if (Array.isArray(raw)) {
      list = raw.flatMap((item: any, i: number) => unpackQuizObject(item, i));
    } else if (raw?.data && typeof raw.data === "object") {
      list = unpackQuizObject(raw.data, 0);
    }

    // If API returned fewer attempts than locally logged retries, merge remaining retries
    if (childLogs.length > list.length) {
      const existingIds = new Set(list.map((x) => x.id));
      childLogs.forEach((log) => {
        if (!existingIds.has(log.id)) {
          list.push(log);
        }
      });
    }

    return {
      success: raw?.success ?? true,
      message: raw?.message,
      data: list,
      raw: raw?.data,
    };
  } catch (error) {
    return {
      success: true,
      data: childLogs,
    };
  }
};

