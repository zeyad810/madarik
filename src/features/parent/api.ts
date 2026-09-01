import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import type { Child } from "@/types/auth";
import {
  AddChildPayload,
  AddChildResponse,
  ChildReportsResponse,
  DeleteChildResponse,
  ParentChildrenResponse,
  ParentSettingsPayload,
  ParentSettingsResponse,
  SingleChildReportResponse,
  SingleChildResponse,
  ToggleChildStatusResponse,
  UpdateChildPayload,
  UpdateChildResponse,
  UpdateParentPasswordPayload,
  UpdateParentPasswordResponse,
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
 * POST /children
 * Adds a new child profile.
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

  const response = await fetch(`${API_BASE_URL}/children`, {
    method: "POST",
    headers: buildHeaders(token, isMultipart),
    body,
  });

  return await handleResponse<AddChildResponse>(response);
};

/**
 * PATCH /children/{id}
 * Updates an existing child profile.
 */
export const updateChild = async (
  payload: UpdateChildPayload,
  token?: string | null,
  isFree?: boolean
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
    formData.append("_method", "PATCH");
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

  const endpoint = `${API_BASE_URL}/children/${id}`;
  const method = isMultipart ? "POST" : "PATCH";

  const response = await fetch(endpoint, {
    method,
    headers: buildHeaders(token, isMultipart),
    body,
  });

  return await handleResponse<UpdateChildResponse>(response);
};

/**
 * GET /children
 * Fetches the children list.
 */
export const getChildren = async (
  token?: string | null
): Promise<ParentChildrenResponse> => {
  const response = await fetch(`${API_BASE_URL}/children`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<ParentChildrenResponse>(response);
};

export const getParentChildren = getChildren;

/**
 * Fetches the child profile (delegates to /children).
 */
export const getFreeChild = async (
  token?: string | null
): Promise<{ success?: boolean; message?: string; data?: Child; child?: Child }> => {
  const res = await getChildren(token);
  const child = res.data && res.data[0] ? res.data[0] : undefined;
  return { success: res.success, data: child, child };
};

/**
 * GET /children/{id}
 * Fetches a single child profile by ID.
 */
export const getChild = async (
  childId: string | number,
  token?: string | null
): Promise<SingleChildResponse> => {
  const response = await fetch(`${API_BASE_URL}/children/${childId}`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<SingleChildResponse>(response);
};

export const getChildById = getChild;

/**
 * GET /children/{id}/report
 * Fetches comprehensive report for a specific child, falling back to /children/{id}.
 */
export const getChildReport = async (
  childId: string | number,
  token?: string | null
): Promise<SingleChildReportResponse> => {
  const resolvedToken = token || getStoredAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/children/${childId}/report`, {
      method: "GET",
      headers: buildHeaders(resolvedToken),
    });
    return await handleResponse<SingleChildReportResponse>(response);
  } catch {
    const fallbackResponse = await fetch(`${API_BASE_URL}/children/${childId}`, {
      method: "GET",
      headers: buildHeaders(resolvedToken),
    });
    return await handleResponse<SingleChildReportResponse>(fallbackResponse);
  }
};

/**
 * PATCH /children/{id}/toggle
 * Toggles the active/deactivated status of a child profile.
 */
export const toggleChildStatus = async (
  childId: string | number,
  token?: string | null
): Promise<ToggleChildStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/children/${childId}/toggle`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });

  return await handleResponse<ToggleChildStatusResponse>(response);
};

/**
 * DELETE /children/{id}
 * Deletes a child profile by ID.
 */
export const deleteChild = async (
  childId: string | number,
  token?: string | null
): Promise<DeleteChildResponse> => {
  const response = await fetch(`${API_BASE_URL}/children/${childId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  return await handleResponse<DeleteChildResponse>(response);
};

/**
 * GET /children
 * Fetches children profiles and reports.
 */
export const getParentChildReports = async (
  token?: string | null
): Promise<ChildReportsResponse> => {
  const response = await fetch(`${API_BASE_URL}/children`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<ChildReportsResponse>(response);
};

/**
 * GET /parent/settings
 * Fetches the authenticated parent's settings.
 */
export const getParentSettings = async (
  token?: string | null
): Promise<ParentSettingsResponse> => {
  const response = await fetch(`${API_BASE_URL}/parent/settings`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  return await handleResponse<ParentSettingsResponse>(response);
};

/**
 * PATCH /parent/settings
 * Updates the authenticated parent's settings (name, notifications, etc.).
 */
export const updateParentSettings = async (
  payload: ParentSettingsPayload,
  token?: string | null
): Promise<ParentSettingsResponse> => {
  const response = await fetch(`${API_BASE_URL}/parent/settings`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify({
      name: payload.name.trim(),
      ...(payload.notifications_enabled !== undefined
        ? { notifications_enabled: payload.notifications_enabled }
        : {}),
    }),
  });

  return await handleResponse<ParentSettingsResponse>(response);
};



/**
 * PUT /parent/settings/password
 * Updates the authenticated parent's password.
 */
export const updateParentPassword = async (
  payload: UpdateParentPasswordPayload,
  token?: string | null
): Promise<UpdateParentPasswordResponse> => {
  const newPass = payload.new_password || payload.newPassword || "";
  const currentPass = payload.current_password || payload.currentPassword || "";
  const confirmPass =
    payload.new_password_confirmation ||
    payload.confirm_password ||
    payload.confirmPassword ||
    payload.password_confirmation ||
    newPass;

  const response = await fetch(`${API_BASE_URL}/parent/settings/password`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify({
      current_password: currentPass,
      new_password: newPass,
      new_password_confirmation: confirmPass,
      password: newPass,
      password_confirmation: confirmPass,
      confirm_password: confirmPass,
      ...(payload.currentPassword ? { currentPassword: currentPass } : {}),
      ...(payload.newPassword ? { newPassword: newPass } : {}),
      ...(payload.confirmPassword ? { confirmPassword: confirmPass } : {}),
    }),
  });

  return await handleResponse<UpdateParentPasswordResponse>(response);
};





