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

// ── GET Quiz History / Attempts ───────────────────────────────────────────────

/**
 * Fetches past quiz attempts for the authenticated role 100% dynamically from Backend.
 * Each story/quiz is represented as a single unique row showing:
 * - attempts_count (total number of attempts)
 * - last_score (latest score)
 * - highest_score (highest score)
 * - created_at (latest attempt date)
 *
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

