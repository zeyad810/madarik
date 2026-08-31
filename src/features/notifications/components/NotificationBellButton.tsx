"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationBellButtonProps {
  isOpen: boolean;
  unreadCount: number;
  onToggle: () => void;
}

export const NotificationBellButton: React.FC<NotificationBellButtonProps> = ({
  isOpen,
  unreadCount,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="الإشعارات"
      aria-expanded={isOpen}
      className="relative flex size-10 items-center justify-center rounded-full bg-white text-mad-main shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
    >
      <Bell className="size-5 stroke-[2.2]" />

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
          {unreadCount > 99 ? "+99" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBellButton;
