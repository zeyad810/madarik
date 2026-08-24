"use client";

import React from "react";
import { Toggle } from "@/components/ui/Toggle";

export interface ParentGeneralSettingsProps {
  notificationsEnabled: boolean;
  onNotificationsChange: (enabled: boolean) => void;
}

export const ParentGeneralSettings: React.FC<ParentGeneralSettingsProps> = ({
  notificationsEnabled,
  onNotificationsChange,
}) => {
  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-right">
          الإعدادات العامة
        </h3>

        <div className="space-y-6 sm:space-y-8">
          {/* Notifications Toggle Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              تفعيل الإشعارات
            </span>
            <Toggle
              checked={notificationsEnabled}
              onChange={onNotificationsChange}
              activeColor="bg-[#22C55E]"
              ariaLabel="تفعيل الإشعارات"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentGeneralSettings;
