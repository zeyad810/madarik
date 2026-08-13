import React from "react";
import { Metadata } from "next";
import SidePanle from "@/features/auth/SidePanle";
import RegisterClient from "@/features/auth/RegisterClient";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | مدارك",
  description: "صفحة إنشاء حساب جديد لربط أولياء الأمور والطلاب بمؤسسة مدارك",
};

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-white"
      dir="rtl"
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-between gap-8">
        <div className="w-full flex-1 flex items-center justify-center">
          <RegisterClient />
        </div>
        <SidePanle />
      </div>
    </main>
  );
}
