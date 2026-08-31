"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useDeleteAllNotifications,
} from "../hooks/useNotifications";
import { NotificationItem } from "../types";

interface NotificationDropdownProps {
  className?: string;
}

/**
 * Format relative activity time in Arabic matching the UI design:
 * "منذ ٥ دقائق", "منذ ساعة", "أمس", etc.
 */
function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "الآن";
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقائق`;
  if (diffHours === 1) return "منذ ساعة";
  if (diffHours === 2) return "منذ ساعتين";
  if (diffHours < 24) return `منذ ${diffHours} ساعات`;
  if (diffDays === 1) return "أمس";
  if (diffDays === 2) return "منذ يومين";
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;
  return `منذ ${diffDays} يوماً`;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
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

  // Refetch latest notifications whenever dropdown is opened
  useEffect(() => {
    if (isOpen) {
      refetchNotifications();
      refetchUnreadCount();
    }
  }, [isOpen, refetchNotifications, refetchUnreadCount]);

  // Close dropdown when clicking outside
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

  /**
   * Renders the notification icon image from the backend or falls back gracefully.
   */
  const renderNotificationIcon = (item: NotificationItem) => {
    const iconSource =
      item.icon ||
      item.icon_url ||
      item.image ||
      (item.data?.icon as string | undefined) ||
      (item.data?.image as string | undefined);

    if (iconSource) {
      if (
        typeof iconSource === "string" &&
        (iconSource.startsWith("http://") ||
          iconSource.startsWith("https://") ||
          iconSource.startsWith("/") ||
          iconSource.startsWith("data:"))
      ) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconSource}
            alt=""
            className="size-5 sm:size-5.5 object-contain inline-block shrink-0 align-middle ml-1"
          />
        );
      }
      return (
        <span className="text-base sm:text-lg leading-none inline-block shrink-0 align-middle ml-1">
          {iconSource}
        </span>
      );
    }

    // Default icon fallback based on type matching UI design
    switch (item.type) {
      case "badge":
        return <span className="text-base leading-none inline-block shrink-0 ml-1">🥇</span>;
      case "story":
        return <span className="text-base leading-none inline-block shrink-0 ml-1">📖</span>;
      case "quiz":
        return <span className="text-base leading-none inline-block shrink-0 ml-1">⭐</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} dir="rtl">
      {/* 1. Notification Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
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

      {/* 2. Notification Dropdown Popover */}
      {isOpen && (
        <div
          dir="rtl"
          className="absolute top-full left-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6 z-50 animate-in fade-in zoom-in-95 duration-150 text-right select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100/80">
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl">الإشعارات</h3>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => deleteAllNotifications()}
                disabled={isDeletingAll}
                className="text-xs sm:text-sm text-slate-400 hover:text-red-500 font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {isDeletingAll ? "جاري المسح..." : "مسح الكل"}
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="max-h-96 overflow-y-auto space-y-3.5 px-0.5 custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-6 text-mad-main animate-spin" />
                <p className="text-xs font-medium text-gray-500">جاري تحميل الإشعارات...</p>
              </div>
            ) : notifications.length === 0 ? (
              /* Empty Notifications State */
              <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                <div className="size-16 sm:size-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400 shadow-2xs">
                  <Bell className="size-8 stroke-[1.5] text-slate-400" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                  لا توجد إشعارات جديدة
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 text-center max-w-xs leading-relaxed">
                  ستظهر التنبيهات وأنشطة طفلك هنا فور حدوثها
                </p>
              </div>
            ) : (
              /* Populated Notifications List */
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className="group relative flex flex-col gap-1 pb-3.5 border-b border-gray-100 last:border-b-0 cursor-pointer text-right transition-colors"
                >
                  {/* Top Row: Title with Icon & Relative Time */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Unread indicator purple dot */}
                      {!item.is_read && (
                        <span className="size-2 rounded-full bg-[#7939E3] shrink-0" />
                      )}
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {renderNotificationIcon(item)}
                      </h4>
                    </div>

                    <span className="text-xs text-slate-400 shrink-0 font-normal select-none">
                      {item.created_at ? formatRelativeTime(item.created_at) : ""}
                    </span>
                  </div>

                  {/* Notification message description */}
                  {item.message ? (
                    <p
                      className={`text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed text-right ${
                        !item.is_read ? "pr-4" : ""
                      }`}
                    >
                      {item.message}
                    </p>
                  ) : null}

                  {/* Action Link (if provided) */}
                  {item.link ? (
                    <Link
                      href={item.link}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!item.is_read) {
                          markAsRead(item.id);
                        }
                        setIsOpen(false);
                      }}
                      className={`inline-flex items-center gap-1 text-xs text-[#7939E3] font-bold mt-1 hover:underline cursor-pointer ${
                        !item.is_read ? "pr-4" : ""
                      }`}
                    >
                      <span>عرض التفاصيل</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
