"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  ExternalLink,
  BookOpen,
  Award,
  CreditCard,
  HelpCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../hooks/useNotifications";
import { NotificationItem, NotificationType } from "../types";
import { formatArabicActivityTime } from "@/lib/utils";

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

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

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const renderNotificationIcon = (type?: NotificationType) => {
    switch (type) {
      case "story":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shrink-0">
            <BookOpen className="size-4.5" />
          </div>
        );
      case "quiz":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
            <HelpCircle className="size-4.5" />
          </div>
        );
      case "badge":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <Award className="size-4.5" />
          </div>
        );
      case "subscription":
      case "package":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
            <CreditCard className="size-4.5" />
          </div>
        );
      case "success":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-green-100 text-green-600 shrink-0">
            <CheckCircle2 className="size-4.5" />
          </div>
        );
      case "warning":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 shrink-0">
            <AlertTriangle className="size-4.5" />
          </div>
        );
      case "error":
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
            <XCircle className="size-4.5" />
          </div>
        );
      default:
        return (
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-100 text-mad-main shrink-0">
            <Info className="size-4.5" />
          </div>
        );
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markAsRead(item.id);
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
          className="absolute top-full left-0 mt-3 w-80 sm:w-96 bg-white rounded-[24px] shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-right select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 px-1 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-base">الإشعارات</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-purple-100 text-mad-main px-2.5 py-0.5 rounded-full font-bold">
                  {unreadCount} جديدة
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead(notifications)}
                  disabled={isMarkingAll}
                  className="text-mad-main hover:text-purple-700 flex items-center gap-1 font-bold cursor-pointer transition-colors disabled:opacity-50"
                  title="تحديد الكل كمقروء"
                >
                  <CheckCheck className="size-4" />
                  <span>قراءة الكل</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 my-2.5 px-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-mad-main text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                filter === "unread"
                  ? "bg-mad-main text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              غير مقروءة ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-84 overflow-y-auto space-y-1.5 px-0.5 custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-6 text-mad-main animate-spin" />
                <p className="text-xs font-medium text-gray-500">جاري تحميل الإشعارات...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <Bell className="size-8 stroke-1 text-gray-300" />
                <p className="text-sm font-medium">
                  {filter === "unread"
                    ? "لا توجد إشعارات غير مقروءة"
                    : "لا توجد إشعارات حالياً"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative flex items-start gap-3 p-3 rounded-2xl transition-all border text-right cursor-pointer ${
                    !item.is_read
                      ? "bg-[#F7F5FF] border-purple-200/70 hover:bg-purple-100/50"
                      : "border-transparent bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Icon */}
                  {renderNotificationIcon(item.type)}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm leading-tight truncate ${
                          !item.is_read
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-700"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                        {item.created_at ? formatArabicActivityTime(item.created_at) : ""}
                      </span>
                    </div>

                    {item.message ? (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    ) : null}

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
                        className="inline-flex items-center gap-1 text-xs text-mad-main font-bold mt-1.5 hover:underline cursor-pointer"
                      >
                        <span>عرض التفاصيل</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    ) : null}
                  </div>
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
