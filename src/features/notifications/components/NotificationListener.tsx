"use client";

import { useNotificationStream } from "../hooks/useNotificationStream";

/**
 * Global SSE Notification Listener Component.
 * Placed in RootLayout to establish and maintain real-time notification streaming
 * across the entire application whenever an authenticated session is active.
 */
export function NotificationListener() {
  useNotificationStream();
  return null;
}

export default NotificationListener;
