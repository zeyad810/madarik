"use client";

import React, { ReactNode } from "react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AccessDeniedFallback } from "./AccessDeniedFallback";
import { hasRoleAccess } from "@/lib/roles";

interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  children: ReactNode;
}

/**
 * RoleGuard restricts rendering to users with specific roles (e.g., 'parent', 'free', 'free_customer').
 * The user's role is sourced strictly from the authenticated session, never from the URL.
 */
export function RoleGuard({
  allowedRoles,
  fallback = <AccessDeniedFallback />,
  loadingFallback = null,
  children,
}: RoleGuardProps) {
  const { user_type, userRole, isLoading, isAuthenticated } = useActiveAccount();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  const currentRole = user_type || userRole;

  if (!isAuthenticated || !currentRole) {
    return <>{fallback}</>;
  }

  const hasAccess = hasRoleAccess(currentRole, allowedRoles);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default RoleGuard;

