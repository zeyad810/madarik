// ────────────────────────────────────────────────────────────────────────────
// Quiz Feature — Utilities
// ────────────────────────────────────────────────────────────────────────────

import { ROLES_WITH_HISTORY } from "./constants";

/**
 * Maps a normalized user role to the correct API prefix segment.
 *
 * visitor          → "public"
 * free_customer    → "free"
 * parent / child   → "parent"
 * student          → "student"
 */
export function getQuizApiPrefix(role: string): string {
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
      // visitor / unauthenticated
      return "public";
  }
}

/**
 * Formats total seconds into "MM:SS" (or "HH:MM:SS" if >= 1 hour) display string.
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safeSeconds / 3600);
  const m = Math.floor((safeSeconds % 3600) / 60);
  const s = safeSeconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Formats elapsed seconds into friendly Arabic text (e.g. "دقيقة و 25 ثانية").
 */
export function formatDurationArabic(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  if (safeSeconds === 0) return "أقل من ثانية";
  const h = Math.floor(safeSeconds / 3600);
  const m = Math.floor((safeSeconds % 3600) / 60);
  const s = safeSeconds % 60;

  const parts: string[] = [];

  if (h > 0) {
    if (h === 1) parts.push("ساعة واحدة");
    else if (h === 2) parts.push("ساعتان");
    else if (h <= 10) parts.push(`${h} ساعات`);
    else parts.push(`${h} ساعة`);
  }

  if (m > 0) {
    if (m === 1) parts.push("دقيقة واحدة");
    else if (m === 2) parts.push("دقيقتان");
    else if (m <= 10) parts.push(`${m} دقائق`);
    else parts.push(`${m} دقيقة`);
  }

  if (s > 0 || parts.length === 0) {
    if (s === 1) parts.push("ثانية واحدة");
    else if (s === 2) parts.push("ثانيتان");
    else if (s <= 10) parts.push(`${s} ثوانٍ`);
    else parts.push(`${s} ثانية`);
  }

  return parts.join(" و ");
}

/**
 * Computes remaining seconds from an absolute expiration timestamp.
 */
export function getRemainingSeconds(expiresAt: number): number {
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

/**
 * Whether a given role can view quiz history.
 */
export function roleHasHistory(role: string): boolean {
  return ROLES_WITH_HISTORY.includes(role as (typeof ROLES_WITH_HISTORY)[number]);
}

/**
 * Formats a date string for display in history items.
 */
export function formatHistoryDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/**
 * Returns current timestamp in ms. Isolated in utility module to satisfy React Compiler purity rules.
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Computes elapsed seconds from a start timestamp.
 */
export function calculateElapsedSeconds(startMs: number | null): number {
  if (!startMs) return 0;
  return Math.max(1, Math.round((Date.now() - startMs) / 1000));
}

/**
 * Returns Arabic human-readable label for a question type.
 */
export function getQuestionTypeLabel(
  type?: string,
  options?: string[]
): string {
  const normalized = (type || "").toLowerCase().trim();
  if (
    normalized === "tf" ||
    normalized === "true_false" ||
    normalized === "true-false" ||
    normalized === "truefalse" ||
    normalized === "boolean" ||
    normalized === "tf_question" ||
    normalized.includes("صح") ||
    normalized.includes("خطأ")
  ) {
    return "صح أو خطأ";
  }

  // Also verify options: if options are 2 items containing 'صح' / 'صواب' / 'خطأ'
  if (
    Array.isArray(options) &&
    options.length === 2 &&
    (options.some((opt) => String(opt).trim() === "صح" || String(opt).trim() === "صواب") ||
     options.some((opt) => String(opt).trim() === "خطأ"))
  ) {
    return "صح أو خطأ";
  }

  return "اختيار متعدد";
}
