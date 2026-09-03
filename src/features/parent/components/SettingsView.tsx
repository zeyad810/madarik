"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import {
  useParentChildren,
  useParentSettings,
  useUpdateParentSettings,
  useUpdateParentPassword,
  useAccountSubscriptionHistory,
} from "../hooks";
import { type ParentSettingsFormData } from "../validation";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import { ParentProfileBanner } from "./ParentProfileBanner";
import { ParentProfileCard } from "./ParentProfileCard";

export const SettingsView: React.FC = () => {
  const { activeAccount, isParentRole } = useActiveAccount();
  const { children } = useParentChildren();
  const { childrenCount: serverChildrenCount, account: historyAccount } = useAccountSubscriptionHistory();

  // Queries and mutations for account/settings and account/settings/password
  const { data: serverSettingsData } = useParentSettings();
  const updateSettingsMutation = useUpdateParentSettings();
  const updatePasswordMutation = useUpdateParentPassword();

  // Profile data from server / session (strictly for parent)
  const defaultParent = useMemo(() => {
    const parentAvatar =
      serverSettingsData?.data?.avatar_img ||
      serverSettingsData?.data?.avatar ||
      activeAccount?.rawParent?.avatar_img ||
      activeAccount?.rawParent?.avatar ||
      (activeAccount?.isParent ? activeAccount?.avatar_img || activeAccount?.avatar : null) ||
      "/assets/user_avatar.png";

    return {
      name:
        serverSettingsData?.data?.name ||
        activeAccount?.rawParent?.name ||
        (activeAccount?.isParent ? activeAccount?.name : "") ||
        "",
      phone:
        serverSettingsData?.data?.phone ||
        activeAccount?.rawParent?.phone ||
        (activeAccount?.isParent ? (activeAccount as any)?.phone : "") ||
        "",
      avatar: parentAvatar,
    };
  }, [serverSettingsData, activeAccount]);

  const [profileData, setProfileData] = useState(defaultParent);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync profile data when server settings or account changes
  useEffect(() => {
    const newName =
      serverSettingsData?.data?.name ||
      activeAccount?.rawParent?.name ||
      (activeAccount?.isParent ? activeAccount?.name : "") ||
      "";
    const newPhone =
      serverSettingsData?.data?.phone ||
      activeAccount?.rawParent?.phone ||
      (activeAccount?.isParent ? (activeAccount as any)?.phone : "") ||
      "";
    const newAvatar =
      serverSettingsData?.data?.avatar_img ||
      serverSettingsData?.data?.avatar ||
      activeAccount?.rawParent?.avatar_img ||
      activeAccount?.rawParent?.avatar ||
      (activeAccount?.isParent ? activeAccount?.avatar_img || activeAccount?.avatar : null) ||
      "/assets/user_avatar.png";

    setProfileData((prev) => ({
      name: newName || prev.name,
      phone: newPhone || prev.phone,
      avatar: newAvatar || prev.avatar,
    }));
  }, [serverSettingsData, activeAccount]);

  // Children count display string in Arabic
  const effectiveChildrenCount = (children && children.length > 0) ? children.length : (serverChildrenCount ?? 0);
  const childrenCountText =
    effectiveChildrenCount === 1
      ? "طفل واحد"
      : effectiveChildrenCount === 2
      ? "طفلان"
      : effectiveChildrenCount >= 3 && effectiveChildrenCount <= 10
      ? `${effectiveChildrenCount} أطفال`
      : effectiveChildrenCount > 10
      ? `${effectiveChildrenCount} طفلاً`
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

  // Handle saving modified profile using account/settings and account/settings/password
  const handleSaveProfile = async (data: ParentSettingsFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Call account/settings endpoint
      await updateSettingsMutation.mutateAsync({
        name: data.name.trim(),
      });

      // 2. If new password is provided, call account/settings/password endpoint
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
            4. PERSONAL INFORMATION CARD
           ========================================================================= */}
        <div>
          <ParentProfileCard
            profileData={profileData}
            isEditing={isEditingProfile}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
};


export default SettingsView;