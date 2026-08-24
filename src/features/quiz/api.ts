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
  if (typeof window !== "undefined") {
    console.log("[buildHeaders] token passed:", token ? "✅ present" : "❌ null/undefined");
    console.log("[buildHeaders] resolvedToken:", resolvedToken ? "✅ present" : "❌ null/undefined");
    if (resolvedToken) console.log("[buildHeaders] token prefix:", resolvedToken.slice(0, 20) + "...");
  }
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
 *
 * Payload format:
 * {
 *   "started_at": "2026-08-19T10:00:00Z",
 *   "answers": {
 *     "question_id_1": "answer_1",
 *     "question_id_2": "answer_2"
 *   }
 * }
 */
export const submitQuiz = async (
  quizId: string,
  role: string = "visitor",
  payload: SubmitQuizPayload,
  token?: string | null
): Promise<SubmitQuizResponse> => {
  const prefix = getQuizApiPrefix(role);
  const endpoint = `${API_BASE_URL}/${prefix}/quiz/${quizId}`;

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

  const formattedBody = {
    started_at: payload.started_at || new Date().toISOString(),
    answers: answersMap,
  };

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

// ── GET Quiz History / Attempts ───────────────────────────────────────────────

/**
 * Fetches past quiz attempts for the authenticated role.
 * - student:        GET student/attempts-log
 * - parent / child: GET parent/children/{id}/quiz-attempts
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

  let endpoint = "";
  if (prefix === "student") {
    endpoint = `${API_BASE_URL}/student/attempts-log`;
  } else if (prefix === "parent") {
    // If targetId is a childId
    endpoint = targetIdOrQuizId
      ? `${API_BASE_URL}/parent/children/${targetIdOrQuizId}/quiz-attempts`
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
    const list = Array.isArray(raw?.data?.data)
      ? raw.data.data
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
      ? raw
      : [];

    return {
      success: raw?.success ?? true,
      message: raw?.message,
      data: list,
    };
  } catch (error) {
    return { success: true, data: [] };
  }
};

