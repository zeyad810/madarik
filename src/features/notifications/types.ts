export type NotificationType =
  | "system"
  | "quiz"
  | "story"
  | "subscription"
  | "package"
  | "badge"
  | "info"
  | "success"
  | "warning"
  | "error"
  | string;

export interface NotificationItem {
  id: number | string;
  target_id?: string;
  target_type?: string;
  type?: NotificationType;
  title: string;
  message?: string;
  icon?: string | null;
  icon_url?: string | null;
  image?: string | null;
  data?: Record<string, unknown> | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  link?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: NotificationItem[];
  message?: string;
}

export interface UnreadCountResponse {
  success?: boolean;
  data?: { unread_count?: number; count?: number } | number;
  unread_count?: number;
  count?: number;
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}
