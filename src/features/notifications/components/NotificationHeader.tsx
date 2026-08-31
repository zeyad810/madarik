"use client";

import React from "react";

interface NotificationHeaderProps {
  hasNotifications: boolean;
  isDeletingAll: boolean;
  onDeleteAll: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  hasNotifications,
  isDeletingAll,
  onDeleteAll,
}) => {
  return (
    <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100/80">
      <h3 className="font-bold text-gray-900 text-lg sm:text-xl">الإشعارات</h3>
      {hasNotifications && (
        <button
          type="button"
          onClick={onDeleteAll}
          disabled={isDeletingAll}
          className="text-xs sm:text-sm text-slate-400 hover:text-red-500 font-medium cursor-pointer transition-colors disabled:opacity-50"
        >
          {isDeletingAll ? "جاري المسح..." : "مسح الكل"}
        </button>
      )}
    </div>
  );
};

export default NotificationHeader;
