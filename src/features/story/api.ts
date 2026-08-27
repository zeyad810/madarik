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
 * Roles that do NOT persist history / finish events.
 * visitor → no auth, no history
 * free_customer → shows result only, no history saved
 */
const GUEST_ROLES = new Set(["visitor", "free", "free_customer", "freecustomer", "customer", "user", "public"]);

function isGuestRole(role: string): boolean {
  return GUEST_ROLES.has((role || "").toLowerCase().trim());
}

// ── Header builder ─────────────────────────────────────────────────────────────

function buildHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const resolved = token || getStoredAuthToken();
  if (resolved) {
    headers["Authorization"] = `Bearer ${resolved}`;
  }
  return headers;
}

// ── GET /stories ───────────────────────────────────────────────────────────────

/**
 * Fetch all stories.
 * Unified endpoint: GET /stories (all roles)
 * visitor / free_customer → no token needed but still calls the same endpoint
 */
export const getFreeStories = async (
  role: string = "visitor",
  token?: string | null,
  search?: string,
  page?: number
): Promise<FreeStoriesResponse> => {
  const params = new URLSearchParams();
  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (typeof page === "number" && page > 0) {
    params.append("page", String(page));
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const endpoint = `${API_BASE_URL}/stories${queryString}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
    next: { revalidate: 60 },
  });

  const raw = await handleResponse<any>(response);
  return normalizeStoriesResponse(raw);
};

/**
 * Helper to safely extract Story[] and pagination from either:
 * - { success: true, data: Story[] }
 * - { success: true, data: { current_page: 1, data: Story[], total: 26, last_page: 2 } }
 * - Story[]
 */
function normalizeStoriesResponse(raw: any): FreeStoriesResponse {
  let storyList: Story[] = [];
  let pagination = undefined;

  if (raw?.data && typeof raw.data === "object" && Array.isArray(raw.data.data)) {
    storyList = raw.data.data;
    pagination = {
      current_page: Number(raw.data.current_page) || 1,
      last_page: Number(raw.data.last_page) || 1,
      per_page: Number(raw.data.per_page) || 20,
      total: Number(raw.data.total) || storyList.length,
      from: raw.data.from,
      to: raw.data.to,
      next_page_url: raw.data.next_page_url,
      prev_page_url: raw.data.prev_page_url,
    };
  } else if (Array.isArray(raw?.data)) {
    storyList = raw.data;
  } else if (Array.isArray(raw)) {
    storyList = raw;
  }

  return {
    success: raw?.success ?? true,
    message: raw?.message ?? "",
    data: storyList,
    pagination,
  };
}

// ── GET /stories/{id} ──────────────────────────────────────────────────────────

/**
 * Fetch a single story by ID.
 * Unified endpoint: GET /stories/{id} (all roles)
 */
export const getStoryById = async (
  id: string,
  role: string = "visitor",
  token?: string | null
): Promise<StoryDetailResponse> => {
  const endpoint = `${API_BASE_URL}/stories/${id}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(token),
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
};

// ── POST /stories/{id}/finish ──────────────────────────────────────────────────

/**
 * Mark a story as finished.
 * Unified endpoint: POST /stories/{id}/finish
 *
 * visitor (unauthenticated) → returns local success without making API call
 * authenticated user (parent with child, student, child, free user) → calls endpoint with Bearer token & child_id/student_id
 */
export const finishStory = async (
  storyId: string,
  role: string = "visitor",
  payload?: FinishStoryPayload,
  token?: string | null
): Promise<FinishStoryResponse> => {
  const resolvedToken = token || getStoredAuthToken();

  // If no auth token is available (visitor without session), return local success
  if (!resolvedToken) {
    return { success: true, message: "تم إنهاء القصة" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${resolvedToken}`,
  };

  const endpoint = `${API_BASE_URL}/stories/${storyId}/finish`;

  const bodyData: Record<string, any> = {};
  const effectiveChildId = payload?.child_id || payload?.student_id;
  if (effectiveChildId) {
    bodyData.child_id = effectiveChildId;
  }
  if (payload?.student_id && payload.student_id !== payload.child_id) {
    bodyData.student_id = payload.student_id;
  }
  if (payload?.started_at) {
    bodyData.started_at = payload.started_at;
  }
  if (payload?.finished_at) {
    bodyData.finished_at = payload.finished_at;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(bodyData),
  });

  const raw = await handleResponse<any>(response);
  return {
    success: raw?.success ?? true,
    message: raw?.message ?? "تم تسجيل إنهاء القراءة بنجاح",
    data: raw?.data ?? raw,
  };
};

