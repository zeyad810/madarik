"use client";

import React, { ReactNode } from "react";
import { useActiveAccount } from "@/hooks/useActiveAccount";

interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  children: ReactNode;
}

/**
 * RoleGuard restricts rendering to users with specific roles (e.g., 'parent', 'admin').
 * The user's role is sourced strictly from the authenticated session, never from the URL.
 */
export function RoleGuard({
  allowedRoles,
  fallback = null,
  loadingFallback = null,
  children,
}: RoleGuardProps) {
  const { userRole, isLoading, isAuthenticated } = useActiveAccount();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated || !userRole) {
    return <>{fallback}</>;
  }

  const normalizedRole = userRole.toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  const hasAccess =
    normalizedAllowed.includes(normalizedRole) ||
    (normalizedRole === "parent" &&
      (normalizedAllowed.includes("ولي امر") || normalizedAllowed.includes("ولي الأمر"))) ||
    (normalizedRole === "ولي امر" && normalizedAllowed.includes("parent")) ||
    (normalizedRole === "ولي الأمر" && normalizedAllowed.includes("parent"));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default RoleGuard;
