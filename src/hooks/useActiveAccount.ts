"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ActiveAccount, Child } from "@/types/auth";
import { useAccountStore } from "@/store/useAccountStore";

export function useActiveAccount() {
  const { data: session, status } = useSession();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Zustand global store with localStorage persistence
  const activeAccountId = useAccountStore((state) => state.activeAccountId);
  const setActiveAccountId = useAccountStore((state) => state.setActiveAccountId);
  const resetAccount = useAccountStore((state) => state.resetAccount);

  // Ensure client-side localStorage hydration is complete
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const user = session?.user;
  const children: Child[] = useMemo(() => user?.children || [], [user?.children]);

  // Extract base parent/account role from session
  const rawUserType =
    session?.user_type ||
    (user as unknown as Record<string, unknown>)?.user_type ||
    (user as unknown as Record<string, unknown>)?.role;
  const sessionUserType = rawUserType ? String(rawUserType).toLowerCase() : "visitor";
  const isParentRole =
    sessionUserType === "parent" ||
    sessionUserType === "ولي امر" ||
    sessionUserType === "ولي الأمر";

  // Effective selected ID (safely falling back to "parent" during SSR/loading)
  const currentActiveId = hasHydrated ? activeAccountId : "parent";

  // Match child from session data
  const matchedChild = useMemo<Child | null>(() => {
    if (!currentActiveId || currentActiveId === "parent") return null;
    return children.find((c) => c.id === currentActiveId) || null;
  }, [currentActiveId, children]);

  // If a child ID is in localStorage but does NOT belong to the parent, reset safely
  useEffect(() => {
    if (
      hasHydrated &&
      status === "authenticated" &&
      activeAccountId !== "parent" &&
      !matchedChild &&
      children.length > 0
    ) {
      resetAccount();
    }
  }, [hasHydrated, status, activeAccountId, matchedChild, children.length, resetAccount]);

  // Is parent currently active
  const isParentActive = !matchedChild;

  // Active user_type: child user_type if child is selected, else session user_type
  const activeUserType = useMemo(() => {
    if (matchedChild) {
      return matchedChild.user_type || "child";
    }
    return sessionUserType;
  }, [matchedChild, sessionUserType]);

  // Active account metadata
  const activeAccount = useMemo<ActiveAccount | null>(() => {
    if (!user) return null;

    if (matchedChild) {
      const badges =
        matchedChild.badges_count ??
        matchedChild.badges ??
        ((matchedChild as unknown as Record<string, unknown>).badges as number) ??
        0;

      return {
        id: matchedChild.id,
        type: "child",
        user_type: matchedChild.user_type || "child",
        name: matchedChild.name,
        status: matchedChild.status || "active",
        gender: matchedChild.gender,
        badges,
        isParent: false,
        rawChild: matchedChild,
      };
    }

    return {
      id: "parent",
      type: "parent",
      user_type: sessionUserType,
      name: user.name || (isParentRole ? "ولي الأمر" : "المستخدم"),
      status: user.status || "active",
      isParent: true,
      rawParent: user,
    };
  }, [user, matchedChild, isParentRole, sessionUserType]);

  const activeId = activeAccount?.id || "parent";

  /**
   * Switch the active account globally via Zustand + localStorage with both activeAccountId and user_type
   */
  const switchAccount = useCallback(
    (targetId: string, targetUserType?: string) => {
      const id = targetId || "parent";
      let uType = targetUserType;
      if (!uType) {
        if (id === "parent") {
          uType = sessionUserType;
        } else {
          const found = children.find((c) => c.id === id);
          uType = found?.user_type || "child";
        }
      }
      setActiveAccountId(id, uType);
    },
    [setActiveAccountId, children, sessionUserType]
  );

  /**
   * Link helper (now returns clean paths since state is stored globally)
   */
  const createAccountHref = useCallback((targetPath: string) => targetPath, []);

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
    switchAccount,
    createAccountHref,
    resetAccount,
    isHydrated: hasHydrated,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
