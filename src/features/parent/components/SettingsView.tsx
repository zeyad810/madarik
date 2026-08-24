"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import {
  useParentChildren,
  useParentSettings,
  useUpdateParentSettings,
  useUpdateParentPassword,
} from "../hooks";
import { type ParentSettingsFormData } from "../validation";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import { ParentProfileBanner } from "./ParentProfileBanner";
import { ParentProfileCard } from "./ParentProfileCard";
import { ParentGeneralSettings } from "./ParentGeneralSettings";

export const SettingsView: React.FC = () => {
  const { activeAccount, isParentRole } = useActiveAccount();
  const { children } = useParentChildren();

  // Queries and mutations for parent/settings and parent/settings/password
  const { data: serverSettingsData } = useParentSettings();
  const updateSettingsMutation = useUpdateParentSettings();
  const updatePasswordMutation = useUpdateParentPassword();

  // Profile data from server / session
  const defaultParent = useMemo(() => {
    return {
      name:
        serverSettingsData?.data?.name ||
        activeAccount?.rawParent?.name ||
        activeAccount?.name ||
        "",
      phone:
        serverSettingsData?.data?.phone ||
        activeAccount?.rawParent?.phone ||
        (activeAccount as any)?.phone ||
        "",
      avatar:
        serverSettingsData?.data?.avatar_img ||
        serverSettingsData?.data?.avatar ||
        activeAccount?.rawParent?.children?.[0]?.avatar_img ||
        activeAccount?.avatar ||
        "/assets/user_avatar.png",
    };
  }, [serverSettingsData, activeAccount]);

  const [profileData, setProfileData] = useState(defaultParent);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    serverSettingsData?.data?.notifications_enabled ?? true
  );

  // Sync profile data when server settings or account changes
  useEffect(() => {
    const newName =
      serverSettingsData?.data?.name ||
      activeAccount?.rawParent?.name ||
      activeAccount?.name ||
      "";
    const newPhone =
      serverSettingsData?.data?.phone ||
      activeAccount?.rawParent?.phone ||
      (activeAccount as any)?.phone ||
      "";
    const newAvatar =
      serverSettingsData?.data?.avatar_img ||
      serverSettingsData?.data?.avatar ||
      activeAccount?.rawParent?.children?.[0]?.avatar_img ||
      activeAccount?.avatar ||
      "/assets/user_avatar.png";

    setProfileData((prev) => ({
      name: newName || prev.name,
      phone: newPhone || prev.phone,
      avatar: newAvatar || prev.avatar,
    }));

    if (serverSettingsData?.data?.notifications_enabled !== undefined) {
      setNotificationsEnabled(serverSettingsData.data.notifications_enabled);
    }
  }, [serverSettingsData, activeAccount]);

  // Children count display string in Arabic
  const childrenCount = children?.length ?? 0;
  const childrenCountText =
    childrenCount === 1
      ? "طفل واحد"
      : childrenCount === 2
      ? "طفلان"
      : childrenCount >= 3 && childrenCount <= 10
      ? `${childrenCount} أطفال`
      : childrenCount > 10
      ? `${childrenCount} طفلاً`
      : "";

  const roleText = isParentRole
    ? childrenCountText
      ? `ولي الأمر - ${childrenCountText}`
      : "ولي الأمر"
    : "مستخدم";


  // Toggle edit mode
  const handleToggleEdit = () => {
    if (!isEditingProfile) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
    setIsEditingProfile((prev) => !prev);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEditingProfile(false);
  };

  // Handle saving modified profile using parent/settings and parent/settings/password
  const handleSaveProfile = async (data: ParentSettingsFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Call parent/settings endpoint
      await updateSettingsMutation.mutateAsync({
        name: data.name.trim(),
      });

      // 2. If new password is provided, call parent/settings/password endpoint
      if (data.newPassword && data.newPassword.trim().length > 0) {
        await updatePasswordMutation.mutateAsync({
          current_password: data.currentPassword,
          new_password: data.newPassword,
          new_password_confirmation: data.confirmPassword || data.newPassword,
          confirm_password: data.confirmPassword || data.newPassword,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword || data.newPassword,
        });
      }

      setProfileData((prev) => ({
        ...prev,
        name: data.name.trim(),
      }));

      setSuccessMessage("تم حفظ التعديلات بنجاح");
      setTimeout(() => {
        setSuccessMessage(null);
        setIsEditingProfile(false);
      }, 800);
    } catch (err: unknown) {
      const msg = extractAuthErrorMessage(
        err,
        "حدث خطأ أثناء حفظ البيانات"
      );
      setErrorMessage(msg);
    }
  };


  const handleNotificationsChange = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    updateSettingsMutation.mutate({
      name: profileData.name,
      notifications_enabled: enabled,
    });
  };


  return (
    <div className="w-full min-h-screen bg-[#FAFAFB] section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/"
                  className="text-mad-main font-bold hover:underline transition-colors"
                >
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-mad-main font-semibold">
                  الملف الشخصي
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. PAGE HEADER (Title + Subtitle)
           ========================================================================= */}
        <div className="text-right space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            حساب ولي الأمر
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-xl">
            إدارة بياناتك ومتابعة رحلة أطفالك التعليمية من مكان واحد.
          </p>
        </div>

        {/* =========================================================================
            3. TOP PROFILE BANNER CARD
           ========================================================================= */}
        <ParentProfileBanner
          name={profileData.name}
          avatar={profileData.avatar}
          roleText={roleText}
          isEditing={isEditingProfile}
          onToggleEdit={handleToggleEdit}
        />

        {/* =========================================================================
            4. TWO-COLUMN CARDS GRID (Personal Info & General Settings)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* RIGHT CARD: Personal Information - View / Edit Mode */}
          <ParentProfileCard
            profileData={profileData}
            isEditing={isEditingProfile}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />

          {/* LEFT CARD: General Settings */}
          <ParentGeneralSettings
            notificationsEnabled={notificationsEnabled}
            onNotificationsChange={handleNotificationsChange}
          />
        </div>
      </div>
    </div>
  );
};


export default SettingsView;