import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import type { StudentProfileResponse } from "./types";

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

/**
 * GET /student/profile
 * Fetches the student's profile information.
 */
export const getStudentProfile = async (
  token?: string | null
): Promise<StudentProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/student/profile`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<StudentProfileResponse>(response);
};

/**
 * GET /student/my-results
 * Fetches the student's quiz results and attempts list.
 */
export const getStudentMyResults = async (
  token?: string | null
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/student/my-results`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<any>(response);
};
