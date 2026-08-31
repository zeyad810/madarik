"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { NotificationItem } from "../types";
import {
  formatRelativeTime,
  getNotificationIconSource,
  formatNotificationMessage,
} from "../utils";

interface NotificationItemCardProps {
  item: NotificationItem;
  onClick: () => void;
  onLinkClick: () => void;
}

const NotificationIconImage: React.FC<{
  src: string;
  fallback: React.ReactNode;
}> = ({ src, fallback }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setHasError(true)}
      className="size-5 sm:size-6 object-contain inline-block shrink-0 align-middle ml-1 rounded-sm"
    />
  );
};

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  onClick,
  onLinkClick,
}) => {
  const iconSource = getNotificationIconSource(item);
  const typeStr = (item.type || "").toLowerCase();

  const defaultFallback = (() => {
    if (typeStr === "badge" || typeStr === "achievement") {
      return <span className="text-base leading-none inline-block shrink-0 ml-1">🥇</span>;
    }
    if (typeStr === "story") {
      return <span className="text-base leading-none inline-block shrink-0 ml-1">📖</span>;
    }
    if (typeStr === "quiz" || typeStr === "challenge") {
      return <span className="text-base leading-none inline-block shrink-0 ml-1">⭐</span>;
    }
    return null;
  })();

  const renderedIcon = (() => {
    if (!iconSource) return defaultFallback;

    if (
      iconSource.startsWith("http://") ||
      iconSource.startsWith("https://") ||
      iconSource.startsWith("/") ||
      iconSource.startsWith("data:")
    ) {
      return <NotificationIconImage src={iconSource} fallback={defaultFallback} />;
    }

    return (
      <span className="text-base sm:text-lg leading-none inline-block shrink-0 align-middle ml-1">
        {iconSource}
      </span>
    );
  })();

  return (
    <div
      onClick={onClick}
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
            {renderedIcon}
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
          {formatNotificationMessage(item)}
        </p>
      ) : null}

      {/* Action Link (if provided) */}
      {item.link ? (
        <Link
          href={item.link}
          onClick={(e) => {
            e.stopPropagation();
            onLinkClick();
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
  );
};

export default NotificationItemCard;
