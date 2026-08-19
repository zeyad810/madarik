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
 * Formats total seconds into "MM:SS" display string.
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safeSeconds / 60);
  const s = safeSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
