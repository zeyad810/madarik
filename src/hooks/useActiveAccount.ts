"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ActiveAccount, AuthUser, Child } from "@/types/auth";
import { useAccountStore } from "@/store/useAccountStore";
import {
  normalizeRole,
  isStudentRole,
  isChildRole,
  isChildOrStudentRole,
  isFreeRole,
} from "@/lib/roles";

// ============================================================================
// Constants & Configuration
// ============================================================================

export const PARENT_ACCOUNT_ID = "parent";
export const DEFAULT_GIRL_AVATAR = "/assets/girl_avatar.png";
export const DEFAULT_BOY_AVATAR = "/assets/boy_avatar.png";

const PARENT_ROLE_ALIASES = new Set(["parent", "ولي امر", "ولي الأمر"]);
const DEFAULT_VISITOR_ROLE = "visitor";
const DEFAULT_CHILD_ROLE = "child";

// ============================================================================
// Types
// ============================================================================

export interface UseActiveAccountReturn {
  /** The effective active account ID ("parent" or child ID) */
  activeId: string;
  /** The active account ID currently stored / resolved */
  activeAccountId: string;
  /** The active role/user_type (child's user_type if child is selected, else session user_type) */
  user_type: string;
  /** Alias for user_type */
  userRole: string;
  /** The base user_type of the parent/session */
  sessionUserType: string;
  /** Normalized metadata object for the currently active account */
  activeAccount: ActiveAccount | null;
  /** The active child object if a child account is selected, otherwise null */
  activeChild: Child | null;
  /** True if the active account is the parent / root account */
  isParentActive: boolean;
  /** List of children linked to the parent account */
  children: Child[];
  /** True if the authenticated user has a parent role */
  isParentRole: boolean;
  /** True if the active account or user is a child */
  isChild: boolean;
  /** True if the active account or user is a student */
  isStudent: boolean;
  /** True if the active account or user is a child or a student */
  isChildOrStudent: boolean;
  /** True if the active account or user is a free customer / free user */
  isFreeCustomer: boolean;
  /** Switch the active account globally and persist to localStorage */
  switchAccount: (targetId: string, targetUserType?: string) => void;
  /** Helper to generate clean account URLs (state is globally preserved) */
  createAccountHref: (targetPath: string) => string;
  /** Reset active account back to parent */
  resetAccount: () => void;
  /** True once client-side localStorage hydration is complete */
  isHydrated: boolean;
  /** True while the session is loading */
  isLoading: boolean;
  /** True if the user is authenticated */
  isAuthenticated: boolean;
}

// ============================================================================
// Pure Helpers
// ============================================================================

/**
 * Extracts and normalizes the base session user type/role.
 */
function extractSessionUserType(
  session: unknown,
  user: AuthUser | undefined | null
): string {
  const sessionObj = session as Record<string, unknown> | null | undefined;
  const userObj = user as unknown as Record<string, unknown> | null | undefined;

  const rawUserType =
    sessionObj?.user_type || userObj?.user_type || userObj?.role;

  return rawUserType ? normalizeRole(String(rawUserType)) : DEFAULT_VISITOR_ROLE;
}

/**
 * Checks whether the session user type represents a parent.
 */
function checkIsParentRole(sessionUserType: string): boolean {
  return PARENT_ROLE_ALIASES.has(sessionUserType) || normalizeRole(sessionUserType) === "parent";
}


/**
 * Resolves the child's avatar with fallback based on gender.
 */
function resolveChildAvatar(child: Child): string {
  if (child.avatar_img) return child.avatar_img;
  if (child.avatar) return child.avatar;
  return child.gender === "female" ? DEFAULT_GIRL_AVATAR : DEFAULT_BOY_AVATAR;
}

/**
 * Resolves the child's badges count safely.
 */
function resolveChildBadges(child: Child): number {
  const childRecord = child as unknown as Record<string, unknown>;
  return child.badges_count ?? child.badges ?? (childRecord.badges as number) ?? 0;
}

/**
 * Builds normalized ActiveAccount object for a selected child.
 */
function buildChildActiveAccount(child: Child): ActiveAccount {
  return {
    id: child.id,
    type: "child",
    user_type: child.user_type || DEFAULT_CHILD_ROLE,
    name: child.name,
    status: child.status || "active",
    gender: child.gender,
    avatar_img: child.avatar_img || child.avatar,
    avatar: resolveChildAvatar(child),
    badges: resolveChildBadges(child),
    isParent: false,
    rawChild: child,
  };
}

/**
 * Builds normalized ActiveAccount object for the parent account.
 */
function buildParentActiveAccount(
  user: AuthUser,
  sessionUserType: string,
  isParentRole: boolean
): ActiveAccount {
  return {
    id: PARENT_ACCOUNT_ID,
    type: "parent",
    user_type: sessionUserType,
    name: user.name || (isParentRole ? "ولي الأمر" : "المستخدم"),
    status: user.status || "active",
    isParent: true,
    rawParent: user,
  };
}

// ============================================================================
// Main Hook
// ============================================================================

export function useActiveAccount(): UseActiveAccountReturn {
  // 1. Session & Hydration State
  const { data: session, status } = useSession();
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  // 2. Global Account Store (Zustand + localStorage)
  const activeAccountId = useAccountStore((state) => state.activeAccountId);
  const setActiveAccountId = useAccountStore(
    (state) => state.setActiveAccountId
  );
  const resetAccount = useAccountStore((state) => state.resetAccount);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // 3. User & Children Extraction
  const user = session?.user;
  const children: Child[] = useMemo(
    () => user?.children || [],
    [user?.children]
  );

  // 4. Role & Type Extraction
  const sessionUserType = useMemo(
    () => extractSessionUserType(session, user),
    [session, user]
  );
  const isParentRole = useMemo(
    () => checkIsParentRole(sessionUserType),
    [sessionUserType]
  );

  // 5. Active Account Resolution
  // Fall back safely to "parent" during SSR / hydration
  const currentActiveId = hasHydrated ? activeAccountId : PARENT_ACCOUNT_ID;

  const matchedChild = useMemo<Child | null>(() => {
    if (!currentActiveId || currentActiveId === PARENT_ACCOUNT_ID) return null;
    return children.find((c) => c.id === currentActiveId) || null;
  }, [currentActiveId, children]);

  const isParentActive = !matchedChild;

  // Active user_type: child user_type if child is selected, else session user_type
  const activeUserType = useMemo(() => {
    if (matchedChild) {
      return matchedChild.user_type || DEFAULT_CHILD_ROLE;
    }
    if (isFreeRole(sessionUserType)) {
      return "free";
    }
    return sessionUserType;
  }, [matchedChild, sessionUserType]);

  const isChild = useMemo(() => {
    return Boolean(matchedChild) || isChildRole(activeUserType);
  }, [matchedChild, activeUserType]);

  const isStudent = useMemo(() => {
    return isStudentRole(activeUserType);
  }, [activeUserType]);

  const isChildOrStudent = useMemo(() => {
    return isChild || isStudent || isChildOrStudentRole(activeUserType);
  }, [isChild, isStudent, activeUserType]);

  const isFreeCustomer = useMemo(() => {
    return isParentActive && (isFreeRole(activeUserType) || isFreeRole(sessionUserType));
  }, [isParentActive, activeUserType, sessionUserType]);

  // Active account metadata object
  const activeAccount = useMemo<ActiveAccount | null>(() => {
    if (!user) return null;

    if (matchedChild) {
      return buildChildActiveAccount(matchedChild);
    }

    return buildParentActiveAccount(user, sessionUserType, isParentRole);
  }, [user, matchedChild, sessionUserType, isParentRole]);

  const activeId = activeAccount?.id || PARENT_ACCOUNT_ID;

  // 6. Stale Account Recovery Effect
  // If stored child ID no longer belongs to the authenticated parent, safely reset
  useEffect(() => {
    if (
      hasHydrated &&
      status === "authenticated" &&
      activeAccountId !== PARENT_ACCOUNT_ID &&
      !matchedChild &&
      children.length > 0
    ) {
      resetAccount();
    }
  }, [
    hasHydrated,
    status,
    activeAccountId,
    matchedChild,
    children.length,
    resetAccount,
  ]);

  // 7. Actions & Handlers
  const switchAccount = useCallback(
    (targetId: string, targetUserType?: string) => {
      const id = targetId || PARENT_ACCOUNT_ID;
      let uType = targetUserType;

      if (!uType) {
        if (id === PARENT_ACCOUNT_ID) {
          uType = sessionUserType;
        } else {
          const found = children.find((c) => c.id === id);
          uType = found?.user_type || DEFAULT_CHILD_ROLE;
        }
      }

      setActiveAccountId(id, uType);
    },
    [setActiveAccountId, children, sessionUserType]
  );

  const createAccountHref = useCallback(
    (targetPath: string) => targetPath,
    []
  );

  // 8. Return Contract
  return {
    activeId,
    activeAccountId: currentActiveId,
    user_type: activeUserType,
    userRole: activeUserType,
    sessionUserType,
    activeAccount,
    activeChild: matchedChild,
    isParentActive,
    children,
    isParentRole,
    isChild,
    isStudent,
    isChildOrStudent,
    isFreeCustomer,
    switchAccount,
    createAccountHref,
    resetAccount,
    isHydrated: hasHydrated,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
