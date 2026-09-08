"use client";

import React from "react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { SettingsView } from "@/features/parent";
import { StudentProfileView } from "@/features/student";

export const ProfileContainer: React.FC = () => {
  const { isStudent, userRole } = useActiveAccount();

  if (isStudent || userRole === "student") {
    return <StudentProfileView />;
  }

  return <SettingsView />;
};

export default ProfileContainer;
