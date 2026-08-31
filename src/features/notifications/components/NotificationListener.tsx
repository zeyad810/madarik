"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useUnreadNotificationCount } from "../hooks/useNotifications";

/**
 * Global Notification Listener Component.
 * Placed in RootLayout to maintain unread count synchronization in the background
 * across the entire application whenever an authenticated session is active.
 */
export function NotificationListener() {
  const { data: unreadCount } = useUnreadNotificationCount();
  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof unreadCount === "number") {
      // If count increased during active session, alert with subtle toast
      if (prevCountRef.current !== null && unreadCount > prevCountRef.current) {
        toast("لديك إشعار جديد!", {
          icon: "🔔",
          duration: 4000,
          position: "top-left",
        });
      }
      prevCountRef.current = unreadCount;
    }
  }, [unreadCount]);

  return null;
}

export default NotificationListener;
