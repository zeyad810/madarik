export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (childId?: string | null) =>
    ["notifications", "list", childId ? `child_${childId}` : "parent"] as const,
  unreadCount: (childId?: string | null) =>
    ["notifications", "unread-count", childId ? `child_${childId}` : "parent"] as const,
};
