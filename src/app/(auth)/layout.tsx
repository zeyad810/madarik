import React from "react";
import AuthBackButton from "@/features/auth/components/AuthBackButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full" dir="rtl">
      {/* Floating Back to Home button for all auth pages */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-30">
        <AuthBackButton />
      </div>
      {children}
    </div>
  );
}
