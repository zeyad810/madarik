"use client";

import { useUnreadNotificationCount } from "../hooks/useNotifications";
import { useReverbNotifications } from "../hooks/useReverbNotifications";

/**
 * Global Notification Listener Component.
 * Placed in RootLayout to:
 * 1. Maintain real-time WebSocket connection to Laravel Reverb for instant notifications.
 * 2. Keep unread count synchronization in the background across the entire app.
 */
export function NotificationListener() {
  // 1. Establish WebSocket listener on private channel
  useReverbNotifications();

  // 2. Keep unread count query active in cache
  useUnreadNotificationCount();

  return null;
}

export default NotificationListener;
