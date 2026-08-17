import React, { Suspense } from "react";
import { Metadata } from "next";
import SidePanle from "@/features/auth/SidePanle";
import LoginForm from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول | مدارك",
  description: "صفحة تسجيل الدخول لربط أولياء الأمور والطلاب بمؤسسة مدارك",
};

export default function LoginPage() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-white"
      dir="rtl"
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-between gap-8">
        <div className="w-full flex-1 flex items-center justify-center">
          <Suspense fallback={<div className="w-full max-w-[440px] h-96 animate-pulse bg-gray-50 rounded-2xl" />}>
            <LoginForm />
          </Suspense>
        </div>

        <SidePanle />
      </div>
    </main>
  );
}
