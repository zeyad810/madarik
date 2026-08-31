import { API_BASE_URL, handleResponse } from "@/services/api";
import { getStoredAuthToken } from "@/lib/auth";
import type {
  NotificationItem,
  NotificationsResponse,
  UnreadCountResponse,
  MarkNotificationReadResponse,
  DeleteAllNotificationsResponse,
} from "./types";

/**
 * Builds HTTP headers with authorization bearer token.
 */
function buildHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const resolvedToken = token || getStoredAuthToken();
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

/**
 * Helper to safely extract unread count from any backend response structure.
 */
export function extractUnreadCount(payload: unknown): number {
  if (typeof payload === "number") return payload;
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.unread_count === "number") return obj.unread_count;
    if (typeof obj.count === "number") return obj.count;
    if (typeof obj.unread === "number") return obj.unread;
    if (typeof obj.data === "number") return obj.data;
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      if (typeof nested.unread_count === "number") return nested.unread_count;
      if (typeof nested.count === "number") return nested.count;
      if (typeof nested.unread === "number") return nested.unread;
    }
  }
  return 0;
}

/**
 * 1. GET /notifications
 * Fetches notifications list. If childId is provided, appends ?child_id={childId}
 */
export async function getNotifications(
  childId?: string | null,
  token?: string | null
): Promise<NotificationItem[]> {
  const resolvedToken = token || getStoredAuthToken();
  if (!resolvedToken) {
    return [];
  }

  const query = childId ? `?child_id=${encodeURIComponent(childId)}` : "";
  const endpoint = `${API_BASE_URL}/notifications${query}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(resolvedToken),
    cache: "no-store",
  });

  const data = await handleResponse<NotificationsResponse | { data: NotificationItem[] } | NotificationItem[]>(response);

  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray((data as NotificationsResponse).data)) {
    return (data as NotificationsResponse).data;
  }
  return [];
}

/**
 * 2. GET /notifications/unread-count
 * Fetches count of unread notifications. If childId is provided, appends ?child_id={childId}
 */
export async function getUnreadCount(
  childId?: string | null,
  token?: string | null
): Promise<number> {
  const resolvedToken = token || getStoredAuthToken();
  if (!resolvedToken) {
    return 0;
  }

  const query = childId ? `?child_id=${encodeURIComponent(childId)}` : "";
  const endpoint = `${API_BASE_URL}/notifications/unread-count${query}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(resolvedToken),
    cache: "no-store",
  });

  const res = await handleResponse<UnreadCountResponse | number>(response);
  return extractUnreadCount(res);
}

/**
 * 3. PATCH /notifications/{id}/read
 * Marks a specific notification as read.
 */
export async function markNotificationAsRead(
  id: string | number,
  token?: string | null
): Promise<MarkNotificationReadResponse> {
  const endpoint = `${API_BASE_URL}/notifications/${encodeURIComponent(String(id))}/read`;

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: buildHeaders(token),
  });

  return await handleResponse<MarkNotificationReadResponse>(response);
}

/**
 * 4. DELETE /notifications/all
 * Deletes all notifications. If childId is provided, appends ?child_id={childId}
 */
export async function deleteAllNotifications(
  childId?: string | null,
  token?: string | null
): Promise<DeleteAllNotificationsResponse> {
  const query = childId ? `?child_id=${encodeURIComponent(childId)}` : "";
  const endpoint = `${API_BASE_URL}/notifications/all${query}`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  return await handleResponse<DeleteAllNotificationsResponse>(response);
}

