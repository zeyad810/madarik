import type { Child } from "@/types/auth";

/**
 * Returns the number of badges from either children API response shape.
 *
 * GET /children returns `badges_count`, while GET /children/{id} returns the
 * earned badges in `user_badges`.
 */
export function resolveChildBadgesCount(child?: Child | null): number {
  if (!child) return 0;

  const explicitCount = child.badges_count ?? child.badges;
  if (explicitCount !== undefined && explicitCount !== null) {
    const count = Number(explicitCount);
    return Number.isFinite(count) ? count : 0;
  }

  return Array.isArray(child.user_badges) ? child.user_badges.length : 0;
}
