import { API_BASE_URL, handleResponse } from "@/services/api";
import {
  FreeStoriesResponse,
  StoryDetailResponse,
  Story,
  FinishStoryPayload,
  FinishStoryResponse,
} from "./types";
import { getStoredAuthToken } from "@/lib/auth";

/**
 * Maps a user role to the correct story API prefix.
 * Mirrors the same pattern used in features/quiz/utils.ts.
 */
function getStoryApiPrefix(role: string): string {
  const r = (role || "").toLowerCase().trim();
  switch (r) {
    case "parent":
    case "child":
      return "parent";
    case "free_customer":
    case "free":
    case "freecustomer":
    case "customer":
    case "user":
      return "free";
    case "student":
      return "student";
    default:
      return "public";
  }
}

/**
 * Fetch all stories for the current role
 * Role-aware:
 * - visitor: GET /public/free-stories
 * - free_customer: GET /free/stories (with fallback to /public/free-stories)
 * - parent / child: GET /parent/stories (with fallback to /public/free-stories)
 * - student: GET /student/stories (with fallback to /public/free-stories)
 */
export const getFreeStories = async (
  role: string = "visitor",
  token?: string | null
): Promise<FreeStoriesResponse> => {
  const resolvedToken = token || getStoredAuthToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const prefix = getStoryApiPrefix(role);
  const endpoint =
    prefix === "public"
      ? `${API_BASE_URL}/public/free-stories`
      : `${API_BASE_URL}/${prefix}/stories`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      next: { revalidate: 60 },
    });

    const raw = await handleResponse<any>(response);
    return normalizeStoriesResponse(raw);
  } catch (error) {
    // Graceful fallback to public free stories if role-specific stories fail
    if (prefix !== "public") {
      try {
        const fallbackResponse = await fetch(
          `${API_BASE_URL}/public/free-stories`,
          {
            method: "GET",
            headers,
            next: { revalidate: 60 },
          }
        );
        const fallbackRaw = await handleResponse<any>(fallbackResponse);
        return normalizeStoriesResponse(fallbackRaw);
      } catch {
        // ignore
      }
    }
    throw error;
  }
};

/**
 * Helper to safely extract Story[] from either:
 * - { success: true, data: Story[] }
 * - { success: true, data: { current_page: 1, data: Story[], total: 8 } }
 * - Story[]
 */
function normalizeStoriesResponse(raw: any): FreeStoriesResponse {
  let storyList: Story[] = [];

  if (Array.isArray(raw?.data?.data)) {
    storyList = raw.data.data;
  } else if (Array.isArray(raw?.data)) {
    storyList = raw.data;
  } else if (Array.isArray(raw)) {
    storyList = raw;
  }

  return {
    success: raw?.success ?? true,
    message: raw?.message ?? "",
    data: storyList,
  };
}

/**
 * Fetch a single story by ID with attached user auth header.
 */
export const getStoryById = async (
  id: string,
  role: string = "visitor",
  token?: string | null
): Promise<StoryDetailResponse> => {
  const resolvedToken = token || getStoredAuthToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const prefix = getStoryApiPrefix(role);
  const endpoint =
    prefix === "public"
      ? `${API_BASE_URL}/public/stories/${id}`
      : `${API_BASE_URL}/${prefix}/stories/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      next: { revalidate: 60 },
    });

    const raw = await handleResponse<any>(response);
    const storyData: Story = raw?.data?.data
      ? raw.data.data
      : raw?.data
      ? raw.data
      : raw;

    return {
      success: raw?.success ?? true,
      message: raw?.message ?? "",
      data: storyData,
    };
  } catch (error) {
    if (prefix !== "public") {
      const fallbackUrls = [
        `${API_BASE_URL}/free/stories/${id}`,
        `${API_BASE_URL}/public/free-stories/${id}`,
        `${API_BASE_URL}/public/stories/${id}`,
      ];

      for (const url of fallbackUrls) {
        try {
          const fallbackResponse = await fetch(url, {
            method: "GET",
            headers,
            next: { revalidate: 60 },
          });
          const fallbackRaw = await handleResponse<any>(fallbackResponse);
          const fallbackStoryData: Story = fallbackRaw?.data?.data
            ? fallbackRaw.data.data
            : fallbackRaw?.data
            ? fallbackRaw.data
            : fallbackRaw;

          if (fallbackStoryData && fallbackStoryData.id) {
            return {
              success: fallbackRaw?.success ?? true,
              message: fallbackRaw?.message ?? "",
              data: fallbackStoryData,
            };
          }
        } catch {
          // continue to next fallback
        }
      }
    }
    throw error;
  }
};

/**
 * Mark a story as finished / completed:
 * - parent / child: POST /parent/stories/{id}/finish (Endpoint: https://madarik.themiify.com/api/v1/parent/stories/{id}/finish)
 * - student:        POST /student/stories/{id}/finish (Endpoint: https://madarik.themiify.com/api/v1/student/stories/{id}/finish)
 */
export const finishStory = async (
  storyId: string,
  role: string = "visitor",
  payload?: FinishStoryPayload,
  token?: string | null
): Promise<FinishStoryResponse> => {
  const resolvedToken = token || getStoredAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const prefix = getStoryApiPrefix(role);
  const isStudent = prefix === "student" || role.toLowerCase().trim() === "student";

  const endpoint = isStudent
    ? `${API_BASE_URL}/student/stories/${storyId}/finish`
    : `${API_BASE_URL}/parent/stories/${storyId}/finish`;

  const bodyData: Record<string, any> = {};
  const effectiveChildId = payload?.child_id || payload?.student_id;
  if (effectiveChildId) {
    bodyData.child_id = effectiveChildId;
    bodyData.student_id = effectiveChildId;
  }
  if (payload?.started_at) {
    bodyData.started_at = payload.started_at;
  }
  if (payload?.finished_at) {
    bodyData.finished_at = payload.finished_at;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyData),
    });

    // If session was not active (ERR-017 / 404), initialize the reading session first then retry
    if (!response.ok && response.status === 404) {
      try {
        const initEndpoint = isStudent
          ? `${API_BASE_URL}/student/stories/${storyId}`
          : effectiveChildId
          ? `${API_BASE_URL}/parent/stories/${storyId}?child_id=${encodeURIComponent(effectiveChildId)}`
          : `${API_BASE_URL}/parent/stories/${storyId}`;

        await fetch(initEndpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
          },
        });

        // Retry finish request
        const retryResponse = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(bodyData),
        });
        const retryRaw = await handleResponse<any>(retryResponse);
        return {
          success: retryRaw?.success ?? true,
          message: retryRaw?.message ?? "",
          data: retryRaw?.data ?? retryRaw,
        };
      } catch {
        // Continue to standard handleResponse
      }
    }

    const raw = await handleResponse<any>(response);
    return {
      success: raw?.success ?? true,
      message: raw?.message ?? "",
      data: raw?.data ?? raw,
    };
  } catch (error) {
    // If visitor/free fallback
    if (!isStudent && (prefix === "visitor" || prefix === "free")) {
      try {
        const altResponse = await fetch(
          `${API_BASE_URL}/parent/stories/${storyId}/finish`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(bodyData),
          }
        );
        const altRaw = await handleResponse<any>(altResponse);
        return {
          success: altRaw?.success ?? true,
          message: altRaw?.message ?? "",
          data: altRaw?.data ?? altRaw,
        };
      } catch {
        // ignore
      }
    }
    throw error;
  }
};


