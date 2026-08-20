import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import { AddChildPayload, AddChildResponse, ParentChildrenResponse } from "./types";

/**
 * Builds HTTP headers with authorization bearer token.
 */
function buildHeaders(token?: string | null, isMultipart: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  const resolvedToken = token || getStoredAuthToken();
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

/**
 * POST /parent/children
 * Adds a new child profile for the authenticated parent.
 */
export const createChild = async (
  payload: AddChildPayload,
  token?: string | null
): Promise<AddChildResponse> => {
  const hasFile = payload.avatarFile instanceof File;

  let body: BodyInit;
  let isMultipart = false;

  if (hasFile && payload.avatarFile) {
    isMultipart = true;
    const formData = new FormData();
    formData.append("name", payload.name.trim());
    formData.append("birth_date", payload.birth_date);
    formData.append("gender", payload.gender);
    formData.append("status", payload.status || "active");
    formData.append("avatar", payload.avatarFile);
    formData.append("avatar_img", payload.avatarFile);
    body = formData;
  } else {
    body = JSON.stringify({
      name: payload.name.trim(),
      birth_date: payload.birth_date,
      gender: payload.gender,
      status: payload.status || "active",
      ...(payload.avatar_img ? { avatar_img: payload.avatar_img } : {}),
      ...(payload.avatar ? { avatar: payload.avatar } : {}),
    });
  }

  const response = await fetch(`${API_BASE_URL}/parent/children`, {
    method: "POST",
    headers: buildHeaders(token, isMultipart),
    body,
  });

  return await handleResponse<AddChildResponse>(response);
};

/**
 * GET /parent/children
 * Fetches the children list of the authenticated parent.
 */
export const getParentChildren = async (
  token?: string | null
): Promise<ParentChildrenResponse> => {
  const response = await fetch(`${API_BASE_URL}/parent/children`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<ParentChildrenResponse>(response);
};
