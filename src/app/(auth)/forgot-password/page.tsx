import { Metadata } from "next";
import SidePanle from "@/features/auth/SidePanle";
import ForgotPasswordClient from "@/features/auth/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور | مدارك",
  description: "صفحة استعادة كلمة المرور وإعادة تعيينها لحسابات مدارك",
};

export default function ForgotPasswordPage() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-white"
      dir="rtl"
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-between gap-8">
        <div className="w-full flex-1 flex items-center justify-center">
          <ForgotPasswordClient />
        </div>
        <SidePanle />
      </div>
    </main>
  );
}
