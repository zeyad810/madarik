import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NotificationItem } from "./types";

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isConnected: boolean;
  addNotification: (item: NotificationItem) => void;
  setNotifications: (items: NotificationItem[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setConnected: (status: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isConnected: false,

      addNotification: (item) =>
        set((state) => {
          // Avoid duplicate notifications with same ID
          const existingIndex = state.notifications.findIndex((n) => n.id === item.id);
          if (existingIndex !== -1) {
            return state;
          }

          const updated = [item, ...state.notifications];
          const unread = updated.filter((n) => !n.is_read).length;
          return {
            notifications: updated,
            unreadCount: unread,
          };
        }),

      setNotifications: (items) =>
        set({
          notifications: items,
          unreadCount: items.filter((n) => !n.is_read).length,
        }),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.is_read).length,
          };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            is_read: true,
          })),
          unreadCount: 0,
        })),

      removeNotification: (id) =>
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.is_read).length,
          };
        }),

      clearAll: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),

      setConnected: (status) => set({ isConnected: status }),
    }),
    {
      name: "madarik_notifications_storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
