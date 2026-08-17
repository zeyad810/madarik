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

  // Extract user role from session
  const rawUserType = session?.user_type || (user as unknown as Record<string, unknown>)?.user_type;
  const userType = rawUserType ? String(rawUserType).toLowerCase() : "parent";
  const isParentRole =
    userType === "parent" ||
    userType === "ولي امر" ||
    userType === "ولي الأمر";

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
      name: user.name || (isParentRole ? "ولي الأمر" : "المستخدم"),
      status: user.status || "active",
      isParent: true,
      rawParent: user,
    };
  }, [user, matchedChild, isParentRole]);

  const activeId = activeAccount?.id || "parent";

  /**
   * Switch the active account globally via Zustand + localStorage
   */
  const switchAccount = useCallback(
    (targetId: string) => {
      setActiveAccountId(targetId || "parent");
    },
    [setActiveAccountId]
  );

  /**
   * Link helper (now returns clean paths since state is stored globally)
   */
  const createAccountHref = useCallback((targetPath: string) => targetPath, []);

  return {
    activeId,
    activeAccount,
    activeChild: matchedChild,
    isParentActive,
    children,
    userRole: userType,
    isParentRole,
    switchAccount,
    createAccountHref,
    resetAccount,
    isHydrated: hasHydrated,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
