"use client";

import React from "react";
import Link from "next/link";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { RoleGuard } from "@/components/guards";
import {
  BookOpen,
  Award,
  Sparkles,
  UserCheck,
  ArrowLeft,
  CheckCircle,
  Star,
  Layers,
  ShieldCheck,
} from "lucide-react";

export default function ActivitiesTestPage() {
  const {
    activeAccount,
    isParentActive,
    activeChild,
    switchAccount,
    children,
    createAccountHref,
  } = useActiveAccount();

  return (
    <RoleGuard
      allowedRoles={["parent", "child", "free_customer", "student"]}
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center" dir="rtl">
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl max-w-md shadow-sm">
            <h2 className="text-xl font-bold mb-2">يرجى تسجيل الدخول</h2>
            <p className="text-sm text-red-600 mb-4">
              تحتاج لتسجيل الدخول للوصول إلى أنشطة القراءة.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-purple-50/40 to-white py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Quick Navigation & Test Bar */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center size-8 rounded-lg bg-green-100 text-green-700 font-bold text-xs">
                1
              </span>
              <span className="font-bold text-gray-900 text-sm">الصفحة الأولى: أنشطة القراءة</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                متاحة للجميع (ولي الأمر + الطفل)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={createAccountHref("/parent-controls")}
                className="flex items-center gap-1.5 px-4 py-2 bg-mad-main text-white rounded-xl text-xs font-bold shadow-sm hover:bg-mad-main/90 transition-all"
              >
                <span>الانتقال للصفحة الثانية (خاصة بولي الأمر فقط)</span>
                <ArrowLeft className="size-4" />
              </Link>
            </div>
          </div>

          {/* Active Context Banner */}
          <div className="bg-gradient-to-r from-mad-main to-purple-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
                  {isParentActive ? (
                    <>
                      <ShieldCheck className="size-3.5" />
                      <span>حساب ولي الأمر نشط</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      <span>حساب الطفل نشط: {activeChild?.name}</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">
                  {isParentActive
                    ? `مرحباً بك يا ${activeAccount?.name || "ولي الأمر"}`
                    : `أهلاً بالبطل الصغير: ${activeAccount?.name}! 🌟`}
                </h1>
                <p className="text-white/80 text-sm mt-1">
                  {isParentActive
                    ? "أنت في وضع ولي الأمر، يمكنك الاطلاع على كافة الأنشطة والمحتوى المخصص لأطفالك."
                    : `أنت في وضع الطفل (${activeAccount?.name})، يمكنك استكشاف القصص وجمع الأوسمة.`}
                </p>
              </div>

              {/* Quick Account Switcher Buttons for Testing */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-2 shrink-0">
                <span className="text-xs font-semibold text-white/90">تبديل الحساب النشط سريعاً:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => switchAccount("parent")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isParentActive
                        ? "bg-white text-mad-main shadow-md"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    ولي الأمر
                  </button>
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => switchAccount(child.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeChild?.id === child.id
                          ? "bg-white text-mad-main shadow-md"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Active Context */}
          {isParentActive ? (
            /* Parent View */
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-mad-main font-bold">
                  <Layers className="size-5" />
                  <h2 className="text-lg">نظرة عامة على الأنشطة (وضع ولي الأمر)</h2>
                </div>
                <p className="text-sm text-gray-600">
                  كولي أمر، يمكنك استعراض جميع القصص والأنشطة المتاحة وتعيين المهام للأبناء.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-xs font-bold text-mad-main">الأطفال المسجلون</span>
                    <p className="text-2xl font-black text-gray-900 mt-1">{children.length}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <span className="text-xs font-bold text-blue-600">القصص المتاحة</span>
                    <p className="text-2xl font-black text-gray-900 mt-1">24 قصة</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                    <span className="text-xs font-bold text-green-600">حالة الاشتراك</span>
                    <p className="text-2xl font-black text-gray-900 mt-1">نشط ✅</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Child View */
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-mad-main font-bold">
                    <Award className="size-5 text-amber-500" />
                    <h2 className="text-lg">مغامرات {activeChild?.name} في القراءة</h2>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-700">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span>{activeAccount?.badges || 0} أوسمة مكتسبة</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all flex items-start gap-3 bg-gray-50/50">
                    <div className="size-10 rounded-xl bg-purple-100 text-mad-main flex items-center justify-center shrink-0">
                      <BookOpen className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">مغامرة الفضاء السحري</h3>
                      <p className="text-xs text-gray-500 mt-0.5">المستوى الثاني • 15 دقيقة</p>
                      <button className="mt-2 text-xs font-bold text-mad-main hover:underline">
                        ابدأ القراءة الآن ←
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all flex items-start gap-3 bg-gray-50/50">
                    <div className="size-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                      <CheckCircle className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">أسرار حديقة الحيوانات</h3>
                      <p className="text-xs text-gray-500 mt-0.5">مكتملة • حصلت على وسام 🏆</p>
                      <button className="mt-2 text-xs font-bold text-green-700 hover:underline">
                        إعادة القراءة ←
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
