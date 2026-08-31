"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
} from "../api";
import { notificationQueryKeys } from "../constants";
import type { NotificationItem } from "../types";

/**
 * Resolves the effective child ID based on active account or explicit ID.
 * Returns null/undefined when the parent account is active.
 */
export function useResolvedChildId(customChildId?: string | null) {
  const { data: session } = useSession();
  const { activeChild, activeAccountId, isChild, isStudent } = useActiveAccount();

  if (customChildId !== undefined) {
    return customChildId;
  }

  return (
    (activeChild?.id ? activeChild.id : null) ||
    (activeAccountId && activeAccountId !== "parent" ? activeAccountId : null) ||
    ((isChild || isStudent) && session?.user?.id ? session.user.id : null)
  );
}

/**
 * Hook to fetch notifications list for the active account (parent or child).
 * If active account is a child, automatically passes child_id.
 */
export function useNotifications(customChildId?: string | null) {
  const { data: session, status } = useSession();
  const { isAuthenticated } = useActiveAccount();
  const token = session?.accessToken || session?.token || null;
  const childId = useResolvedChildId(customChildId);

  return useQuery<NotificationItem[]>({
    queryKey: notificationQueryKeys.list(childId),
    queryFn: () => getNotifications(childId, token),
    enabled: isAuthenticated && !!token && status !== "loading",
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 60, // Poll every 60s
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch unread notifications count for the active account (parent or child).
 * If active account is a child, automatically passes child_id.
 */
export function useUnreadNotificationCount(customChildId?: string | null) {
  const { data: session, status } = useSession();
  const { isAuthenticated } = useActiveAccount();
  const token = session?.accessToken || session?.token || null;
  const childId = useResolvedChildId(customChildId);

  return useQuery<number>({
    queryKey: notificationQueryKeys.unreadCount(childId),
    queryFn: () => getUnreadCount(childId, token),
    enabled: isAuthenticated && !!token && status !== "loading",
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 30, // Poll every 30s for the badge
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to mark a specific notification as read.
 * Optimistically updates the list and decrements the unread count.
 */
export function useMarkNotificationAsRead(customChildId?: string | null) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken || session?.token || null;
  const childId = useResolvedChildId(customChildId);

  return useMutation({
    mutationFn: (notificationId: string | number) =>
      markNotificationAsRead(notificationId, token),
    onMutate: async (notificationId) => {
      const listKey = notificationQueryKeys.list(childId);
      const unreadKey = notificationQueryKeys.unreadCount(childId);

      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: unreadKey });

      const prevList = queryClient.getQueryData<NotificationItem[]>(listKey);
      const prevUnread = queryClient.getQueryData<number>(unreadKey);

      let wasUnread = false;
      if (prevList) {
        queryClient.setQueryData<NotificationItem[]>(listKey, (old) => {
          if (!old) return [];
          return old.map((item) => {
            if (String(item.id) === String(notificationId)) {
              if (!item.is_read) wasUnread = true;
              return { ...item, is_read: true };
            }
            return item;
          });
        });
      }

      if (wasUnread && typeof prevUnread === "number" && prevUnread > 0) {
        queryClient.setQueryData<number>(unreadKey, prevUnread - 1);
      }

      return { prevList, prevUnread };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.prevList) {
        queryClient.setQueryData(
          notificationQueryKeys.list(childId),
          context.prevList
        );
      }
      if (typeof context?.prevUnread === "number") {
        queryClient.setQueryData(
          notificationQueryKeys.unreadCount(childId),
          context.prevUnread
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.list(childId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.unreadCount(childId),
      });
    },
  });
}

/**
 * Hook to mark all unread notifications as read.
 */
export function useMarkAllNotificationsAsRead(customChildId?: string | null) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken || session?.token || null;
  const childId = useResolvedChildId(customChildId);

  return useMutation({
    mutationFn: async (notifications: NotificationItem[]) => {
      const unreadItems = notifications.filter((n) => !n.is_read);
      if (unreadItems.length === 0) return;

      await Promise.allSettled(
        unreadItems.map((item) => markNotificationAsRead(item.id, token))
      );
    },
    onMutate: async () => {
      const listKey = notificationQueryKeys.list(childId);
      const unreadKey = notificationQueryKeys.unreadCount(childId);

      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: unreadKey });

      const prevList = queryClient.getQueryData<NotificationItem[]>(listKey);
      const prevUnread = queryClient.getQueryData<number>(unreadKey);

      if (prevList) {
        queryClient.setQueryData<NotificationItem[]>(listKey, (old) =>
          (old || []).map((item) => ({ ...item, is_read: true }))
        );
      }
      queryClient.setQueryData<number>(unreadKey, 0);

      return { prevList, prevUnread };
    },
    onError: (_err, _variables, context) => {
      if (context?.prevList) {
        queryClient.setQueryData(
          notificationQueryKeys.list(childId),
          context.prevList
        );
      }
      if (typeof context?.prevUnread === "number") {
        queryClient.setQueryData(
          notificationQueryKeys.unreadCount(childId),
          context.prevUnread
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.list(childId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.unreadCount(childId),
      });
    },
  });
}
