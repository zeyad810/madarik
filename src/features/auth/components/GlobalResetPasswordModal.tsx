"use client";

import React from "react";
import { useSession } from "next-auth/react";
import ResetFirstPasswordModal from "./ResetFirstPasswordModal";

export const GlobalResetPasswordModal: React.FC = () => {
  const { data: session, status } = useSession();

  const rawFlag = session?.user?.change_by_admin;
  const needsPasswordReset =
    status === "authenticated" &&
    Boolean(
      rawFlag === true ||
      (rawFlag as any) === 1 ||
      (rawFlag as any) === "1" ||
      (rawFlag as any) === "true"
    );

  if (!needsPasswordReset) {
    return null;
  }

  return <ResetFirstPasswordModal isOpen={true} />;
};

export default GlobalResetPasswordModal;

