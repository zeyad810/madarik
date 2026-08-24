"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ParentProfileDetails } from "./ParentProfileDetails";
import { ParentProfileForm } from "./ParentProfileForm";
import type { ParentSettingsFormData } from "../validation";

export interface ParentProfileCardProps {
  profileData: {
    name: string;
    phone: string;
    maskedPassword?: string;
  };
  isEditing: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSave: (data: ParentSettingsFormData) => Promise<void> | void;
  onCancel: () => void;
}

export const ParentProfileCard: React.FC<ParentProfileCardProps> = ({
  profileData,
  isEditing,
  errorMessage,
  successMessage,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 text-right">
            {isEditing ? "تعديل البيانات" : "البيانات الشخصية"}
          </h3>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {isEditing ? (
          <ParentProfileForm
            defaultValues={{
              name: profileData.name,
              phone: profileData.phone,
            }}
            onSubmit={onSave}
            onCancel={onCancel}
          />
        ) : (
          <ParentProfileDetails
            name={profileData.name}
            phone={profileData.phone}
          />
        )}
      </div>
    </div>
  );
};

export default ParentProfileCard;
