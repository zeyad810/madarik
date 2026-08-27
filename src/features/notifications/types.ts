export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "quiz"
  | "story"
  | "subscription"
  | "package"
  | "badge"
  | "system"
  | string;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  body?: string;
  type?: NotificationType;
  is_read?: boolean;
  link?: string;
  created_at: string;
  data?: Record<string, unknown>;
}

export interface NotificationStreamPayload {
  id?: string;
  title?: string;
  message?: string;
  body?: string;
  type?: NotificationType;
  link?: string;
  data?: Record<string, unknown>;
  notification?: NotificationItem;
  unread_count?: number;
  created_at?: string;
}
