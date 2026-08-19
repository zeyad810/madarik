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
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

// ── GET Quiz ──────────────────────────────────────────────────────────────────

/**
 * Fetches the quiz by quiz ID with user authentication header.
 */
export const getQuiz = async (
  quizId: string,
  role: string = "visitor",
  token?: string | null
): Promise<QuizResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/quiz/${quizId}`, {
      method: "GET",
      headers: buildHeaders(token),
    });

    return await handleResponse<QuizResponse>(response);
  } catch (error) {
    throw error;
  }
};

// ── POST Check Answer ─────────────────────────────────────────────────────────

/**
 * Checks a single answer for a question and returns correctness feedback.
 */
export const checkQuizAnswer = async (
  quizId: string,
  role: string = "visitor",
  payload: CheckAnswerPayload,
  token?: string | null
): Promise<CheckAnswerResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/quiz/${quizId}/check-answer`,
      {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      }
    );

    return await handleResponse<CheckAnswerResponse>(response);
  } catch (error) {
    throw error;
  }
};

// ── POST Submit Quiz ──────────────────────────────────────────────────────────

/**
 * Submits the complete quiz with all answers and returns the result.
 */
export const submitQuiz = async (
  quizId: string,
  role: string = "visitor",
  payload: SubmitQuizPayload,
  token?: string | null
): Promise<SubmitQuizResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/quiz/${quizId}`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(payload),
    });

    return await handleResponse<SubmitQuizResponse>(response);
  } catch (error) {
    throw error;
  }
};

// ── GET Quiz History ──────────────────────────────────────────────────────────

/**
 * Fetches past quiz attempts for parent/child/student roles.
 */
export const getQuizHistory = async (
  quizId: string,
  role: string,
  token?: string | null
): Promise<QuizHistoryResponse> => {
  const prefix = getQuizApiPrefix(role);
  const response = await fetch(
    `${API_BASE_URL}/${prefix}/quiz/${quizId}/history`,
    {
      method: "GET",
      headers: buildHeaders(token),
    }
  );
  return handleResponse<QuizHistoryResponse>(response);
};
