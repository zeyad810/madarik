import type { NotificationItem } from "./types";

/**
 * Format relative activity time in Arabic matching the UI design:
 * "منذ ٥ دقائق", "منذ ساعة", "أمس", etc.
 */
export function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "الآن";
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقائق`;
  if (diffHours === 1) return "منذ ساعة";
  if (diffHours === 2) return "منذ ساعتين";
  if (diffHours < 24) return `منذ ${diffHours} ساعات`;
  if (diffDays === 1) return "أمس";
  if (diffDays === 2) return "منذ يومين";
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;
  return `منذ ${diffDays} يوماً`;
}

/**
 * Safely extracts notification icon URL or string from item.
 */
export function getNotificationIconSource(item: NotificationItem): string | null {
  let dataObj: Record<string, unknown> | null = null;
  if (item.data && typeof item.data === "object") {
    dataObj = item.data as Record<string, unknown>;
  } else if (typeof item.data === "string") {
    try {
      dataObj = JSON.parse(item.data);
    } catch {
      dataObj = null;
    }
  }

  const source =
    (dataObj?.image as string | undefined) ||
    (dataObj?.icon as string | undefined) ||
    (dataObj?.icon_url as string | undefined) ||
    (dataObj?.badge_image as string | undefined) ||
    (dataObj?.badge_icon as string | undefined) ||
    item.image ||
    item.icon_url ||
    item.icon ||
    (dataObj?.avatar as string | undefined) ||
    (dataObj?.url as string | undefined);

  return source || null;
}

/**
 * Format notification message and replace any template placeholders.
 */
export function formatNotificationMessage(item: NotificationItem): string {
  if (!item.message) return "";
  let msg = item.message;
  if (msg.includes("{required_score}")) {
    let dataObj: Record<string, unknown> | null = null;
    if (item.data && typeof item.data === "object") {
      dataObj = item.data as Record<string, unknown>;
    } else if (typeof item.data === "string") {
      try {
        dataObj = JSON.parse(item.data);
      } catch {
        dataObj = null;
      }
    }
    const score =
      dataObj?.required_score ??
      dataObj?.score ??
      dataObj?.passing_score ??
      "";
    msg = msg.replace("{required_score}", String(score || "").trim());
  }
  return msg;
}
