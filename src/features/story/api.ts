import { API_BASE_URL, handleResponse } from "@/services/api";
import { FreeStoriesResponse, StoryDetailResponse } from "./types";

/**
 * Fetch all free/public stories
 * Endpoint: GET /public/free-stories
 */
export const getFreeStories = async (): Promise<FreeStoriesResponse> => {
  const response = await fetch(`${API_BASE_URL}/public/free-stories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  return await handleResponse<FreeStoriesResponse>(response);
};

/**
 * Fetch a single story by ID
 * Endpoint: GET /public/stories/{id}
 */
export const getStoryById = async (
  id: string
): Promise<StoryDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/public/stories/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  return await handleResponse<StoryDetailResponse>(response);
};
