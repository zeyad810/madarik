import { API_BASE_URL, handleResponse } from "@/services/api";
import { FreeStoriesResponse, StoryDetailResponse, Story } from "./types";
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
 * - parent/child: GET /parent/stories (with fallback to /public/free-stories)
 * - free_customer: GET /free/stories (with fallback to /public/free-stories)
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

  try {
    const response = await fetch(`${API_BASE_URL}/public/free-stories`, {
      method: "GET",
      headers,
      next: { revalidate: 60 },
    });

    const raw = await handleResponse<any>(response);
    return normalizeStoriesResponse(raw);
  } catch (error) {
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

  try {
    const response = await fetch(`${API_BASE_URL}/public/stories/${id}`, {
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
    throw error;
  }
};

