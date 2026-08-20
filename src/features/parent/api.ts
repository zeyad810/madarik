import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import {
  AddChildPayload,
  AddChildResponse,
  ParentChildrenResponse,
  ToggleChildStatusResponse,
  UpdateChildPayload,
  UpdateChildResponse,
} from "./types";

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
 * PUT /parent/children/{id}
 * Updates an existing child profile for the authenticated parent.
 * Endpoint: https://madarik.themiify.com/api/v1/parent/children/{id}
 */
export const updateChild = async (
  payload: UpdateChildPayload,
  token?: string | null
): Promise<UpdateChildResponse> => {
  const { id, ...bodyData } = payload;
  const hasFile = payload.avatarFile instanceof File;

  let body: BodyInit;
  let isMultipart = false;

  if (hasFile && payload.avatarFile) {
    isMultipart = true;
    const formData = new FormData();
    if (bodyData.name) formData.append("name", bodyData.name.trim());
    if (bodyData.birth_date) formData.append("birth_date", bodyData.birth_date);
    if (bodyData.gender) formData.append("gender", bodyData.gender);
    if (bodyData.status) formData.append("status", bodyData.status);
    formData.append("avatar", payload.avatarFile);
    formData.append("avatar_img", payload.avatarFile);
    formData.append("_method", "PUT");
    body = formData;
  } else {
    body = JSON.stringify({
      ...(bodyData.name ? { name: bodyData.name.trim() } : {}),
      ...(bodyData.birth_date ? { birth_date: bodyData.birth_date } : {}),
      ...(bodyData.gender ? { gender: bodyData.gender } : {}),
      ...(bodyData.status ? { status: bodyData.status } : {}),
      ...(bodyData.avatar ? { avatar: bodyData.avatar } : {}),
      ...(bodyData.avatar_img ? { avatar_img: bodyData.avatar_img } : {}),
    });
  }

  const response = await fetch(`${API_BASE_URL}/parent/children/${id}`, {
    method: isMultipart ? "POST" : "PUT",
    headers: buildHeaders(token, isMultipart),
    body,
  });

  return await handleResponse<UpdateChildResponse>(response);
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

/**
 * PATCH /parent/children/{id}/toggle
 * Toggles the active/deactivated status of a child profile.
 */
export const toggleChildStatus = async (
  childId: string | number,
  token?: string | null
): Promise<ToggleChildStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/parent/children/${childId}/toggle`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });

  return await handleResponse<ToggleChildStatusResponse>(response);
};

