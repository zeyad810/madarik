"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { AccessDeniedFallback } from "./AccessDeniedFallback";
import {
  hasRoleAccess,
  isStudentRole,
  isChildRole,
  isChildOrStudentRole,
} from "@/lib/roles";

interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  children: ReactNode;
}

/**
 * RoleGuard restricts rendering to users with specific roles (e.g., 'parent', 'free', 'free_customer').
 * If a child or student attempts to access a protected non-child page, they are immediately redirected to /stories.
 */
export function RoleGuard({
  allowedRoles,
  fallback = <AccessDeniedFallback />,
  loadingFallback = null,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const {
    user_type,
    userRole,
    isLoading,
    isAuthenticated,
    isStudent,
    isChild,
    isChildOrStudent,
  } = useActiveAccount();

  const currentRole = user_type || userRole;
  const hasAccess = hasRoleAccess(currentRole, allowedRoles);
  const userIsChildOrStudent =
    isChildOrStudent ||
    isChild ||
    isStudent ||
    isChildOrStudentRole(currentRole) ||
    isChildRole(currentRole) ||
    isStudentRole(currentRole) ||
    currentRole === "child" ||
    currentRole === "student";

  useEffect(() => {
    if (!isLoading && isAuthenticated && userIsChildOrStudent && !hasAccess) {
      router.push("/stories");
    }
  }, [isLoading, isAuthenticated, userIsChildOrStudent, hasAccess, router]);

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated || !currentRole) {
    return <>{fallback}</>;
  }

  if (!hasAccess) {
    if (userIsChildOrStudent) {
      return (
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="size-10 border-4 border-mad-main border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default RoleGuard;


