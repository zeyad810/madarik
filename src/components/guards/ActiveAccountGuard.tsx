"use client";

import { ReactNode } from "react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { ActiveAccount, Child } from "@/types/auth";

interface ActiveAccountGuardProps {
  /**
   * If true, only renders when an active child is selected.
   */
  requireChild?: boolean;
  /**
   * If true, only renders when the parent account is active.
   */
  requireParent?: boolean;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  children:
    | ReactNode
    | ((context: {
        activeAccount: ActiveAccount;
        activeChild: Child | null;
        isParentActive: boolean;
      }) => ReactNode);
}

/**
 * ActiveAccountGuard ensures the appropriate account context (parent or child)
 * is selected from the URL (?active_user=id) and validated against session permissions.
 */
export function ActiveAccountGuard({
  requireChild = false,
  requireParent = false,
  fallback = null,
  loadingFallback = null,
  children,
}: ActiveAccountGuardProps) {
  const { activeAccount, activeChild, isParentActive, isLoading } = useActiveAccount();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!activeAccount) {
    return <>{fallback}</>;
  }

  if (requireChild && !activeChild) {
    return <>{fallback}</>;
  }

  if (requireParent && !isParentActive) {
    return <>{fallback}</>;
  }

  if (typeof children === "function") {
    return <>{children({ activeAccount, activeChild, isParentActive })}</>;
  }

  return <>{children}</>;
}

export default ActiveAccountGuard;
