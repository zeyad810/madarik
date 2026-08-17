"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ActiveAccount, Child } from "@/types/auth";

export function useActiveAccount() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const children: Child[] = useMemo(() => user?.children || [], [user?.children]);

  // Extract user role from session
  const rawUserType = session?.user_type || (user as unknown as Record<string, unknown>)?.user_type;
  const userType = rawUserType ? String(rawUserType).toLowerCase() : "parent";
  const isParentRole =
    userType === "parent" ||
    userType === "ولي امر" ||
    userType === "ولي الأمر";

  // URL search parameter: ?active_user=[id]
  const activeUserParam = searchParams.get("active_user");

  // Determine active child if requested
  const matchedChild = useMemo<Child | null>(() => {
    if (!activeUserParam || activeUserParam === "parent") return null;
    return children.find((c) => c.id === activeUserParam) || null;
  }, [activeUserParam, children]);

  // Is parent currently active
  const isParentActive = !matchedChild;

  // Active account metadata
  const activeAccount = useMemo<ActiveAccount | null>(() => {
    if (!user) return null;

    if (matchedChild) {
      const badges =
        matchedChild.badges_count ??
        matchedChild.badges ??
        ((matchedChild as unknown as Record<string, unknown>).badges_count as number) ??
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

  // Active account ID string
  const activeId = activeAccount?.id || "parent";

  /**
   * Switch the active account by updating the URL query param (?active_user=id)
   */
  const switchAccount = useCallback(
    (targetId: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!targetId || targetId === "parent") {
        params.delete("active_user");
      } else {
        params.set("active_user", targetId);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return {
    activeId,
    activeAccount,
    activeChild: matchedChild,
    isParentActive,
    children,
    userRole: userType,
    isParentRole,
    switchAccount,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
