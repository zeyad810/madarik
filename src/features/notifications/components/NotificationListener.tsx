"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getStoredAuthToken } from "@/lib/auth";
import { useUnreadNotificationCount } from "../hooks/useNotifications";
import { useReverbNotifications } from "../hooks/useReverbNotifications";

/**
 * Inner component that is only mounted and executed when user is fully authenticated.
 */
function AuthenticatedNotificationListener() {
  // 1. Establish WebSocket listener on private channel
  useReverbNotifications();

  // 2. Keep unread count query active in cache
  useUnreadNotificationCount();

  return null;
}

/**
 * Global Notification Listener Component.
 * Placed in RootLayout. Ensures NO notification code or connections run
 * when the user is unauthenticated or on login/register screens.
 */
export function NotificationListener() {
  const { data: session, status } = useSession();
  const { isAuthenticated, isHydrated } = useActiveAccount();
  const token = getStoredAuthToken(session);

  const isUserAuthenticated = Boolean(
    isHydrated &&
      status === "authenticated" &&
      isAuthenticated &&
      token
  );

  if (!isUserAuthenticated) {
    return null;
  }

  return <AuthenticatedNotificationListener />;
}

export default NotificationListener;
