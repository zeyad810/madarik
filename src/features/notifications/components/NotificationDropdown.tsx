"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getStoredAuthToken } from "@/lib/auth";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useDeleteAllNotifications,
} from "../hooks/useNotifications";
import type { NotificationItem } from "../types";
import { NotificationBellButton } from "./NotificationBellButton";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationItemCard } from "./NotificationItemCard";

export interface NotificationDropdownProps {
  className?: string;
}

const AuthenticatedNotificationDropdown: React.FC<NotificationDropdownProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: notifications = [],
    isLoading,
    refetch: refetchNotifications,
  } = useNotifications();
  const {
    data: unreadCount = 0,
    refetch: refetchUnreadCount,
  } = useUnreadNotificationCount();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteAllNotifications, isPending: isDeletingAll } =
    useDeleteAllNotifications();

  // Refetch latest notifications on open
  useEffect(() => {
    if (isOpen) {
      refetchNotifications();
      refetchUnreadCount();
    }
  }, [isOpen, refetchNotifications, refetchUnreadCount]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }
  };

  const handleLinkClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} dir="rtl">
      {/* 1. Bell Trigger Button */}
      <NotificationBellButton
        isOpen={isOpen}
        unreadCount={unreadCount}
        onToggle={() => setIsOpen((prev) => !prev)}
      />

      {/* 2. Dropdown Popover */}
      {isOpen && (
        <div
          dir="rtl"
          className="absolute top-full -left-8.75 md:left-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6 z-50 animate-in fade-in zoom-in-95 duration-150 text-right select-none"
        >
          {/* Header */}
          <NotificationHeader
            hasNotifications={notifications.length > 0}
            isDeletingAll={isDeletingAll}
            onDeleteAll={() => deleteAllNotifications()}
          />

          {/* Items List Container */}
          <div className="max-h-96 overflow-y-auto space-y-3.5 px-0.5 custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-6 text-mad-main animate-spin" />
                <p className="text-xs font-medium text-gray-500">
                  جاري تحميل الإشعارات...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <NotificationEmptyState />
            ) : (
              notifications.map((item) => (
                <NotificationItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleNotificationClick(item)}
                  onLinkClick={() => handleLinkClick(item)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = (props) => {
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

  return <AuthenticatedNotificationDropdown {...props} />;
};

export default NotificationDropdown;
