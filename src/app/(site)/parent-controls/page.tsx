"use client";

import React from "react";
import Link from "next/link";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { RoleGuard, ActiveAccountGuard } from "@/components/guards";
import {
  ShieldAlert,
  ShieldCheck,
  Settings,
  Users,
  CreditCard,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export default function ParentControlsTestPage() {
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
      allowedRoles={["parent", "free_customer"]}
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center" dir="rtl">
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl max-w-md shadow-sm">
            <h2 className="text-xl font-bold mb-2">غير مصرح بالدخول</h2>
            <p className="text-sm text-red-600 mb-4">
              هذه الصفحة مخصصة فقط للمستخدمين المسجلين بصلاحية ولي الأمر.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-purple-50/40 to-white py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Quick Navigation Bar */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center size-8 rounded-lg bg-purple-100 text-mad-main font-bold text-xs">
                2
              </span>
              <span className="font-bold text-gray-900 text-sm">الصفحة الثانية: لوحة تحكم ولي الأمر</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                خاصة بولي الأمر فقط 🔒
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={createAccountHref("/activities")}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold transition-all"
              >
                <ArrowRight className="size-4" />
                <span>العودة لصفحة الأنشطة (المتاحة للجميع)</span>
              </Link>
            </div>
          </div>

          {/* Context Guard: Require Parent Account */}
          <ActiveAccountGuard
            requireParent
            fallback={
              /* Fallback when active context is a Child */
              <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-8 text-center max-w-xl mx-auto space-y-6">
                <div className="size-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50">
                  <ShieldAlert className="size-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
                    الحساب النشط حالياً: {activeChild?.name} (طفل)
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">
                    صفحة محجوبة عن حساب الطفل
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    لا يمكن للأطفال الوصول إلى إعدادات الرقابة الأبوية أو إدارة الحسابات المالية. للوصول لهذه الصفحة، يرجى التبديل إلى حساب ولي الأمر.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-right space-y-2">
                  <span className="text-xs font-bold text-gray-500">كيف تم الفحص؟</span>
                  <p className="text-xs text-gray-700">
                    قامت <code className="bg-gray-200 px-1.5 py-0.5 rounded text-mad-main font-mono">&lt;ActiveAccountGuard requireParent&gt;</code> بفحص الرابط <code className="bg-gray-200 px-1.5 py-0.5 rounded text-mad-main font-mono">?active_user={activeChild?.id}</code> والتحقق من الجلسة لمنع الطفل من الوصول.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => switchAccount("parent")}
                    className="w-full sm:w-auto px-6 py-3 bg-mad-main text-white font-bold rounded-2xl shadow-lg hover:bg-mad-main/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <UserCheck className="size-4" />
                    <span>التبديل إلى حساب ولي الأمر</span>
                  </button>

                  <Link
                    href="/activities"
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm text-center"
                  >
                    العودة لصفحة الأنشطة
                  </Link>
                </div>
              </div>
            }
          >
            {/* Content Only Shown When Parent Account is Active */}
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-purple-800 to-mad-main rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
                    <ShieldCheck className="size-3.5" />
                    <span>تم التحقق: أنت في وضع ولي الأمر</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">لوحة تحكم ولي الأمر والإشراف</h1>
                  <p className="text-white/80 text-sm mt-1">
                    إدارة بيانات الأبناء، حدود الاستخدام، والاشتراكات.
                  </p>
                </div>

                {/* Quick Account Switcher Buttons for Testing */}
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-2 shrink-0">
                  <span className="text-xs font-semibold text-white/90">اختبار تبديل الحساب:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => switchAccount("parent")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-mad-main shadow-md cursor-pointer"
                    >
                      ولي الأمر (نشط)
                    </button>
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => switchAccount(child.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/20 text-white hover:bg-white/30 transition-all cursor-pointer"
                      >
                        التبديل إلى {child.name} (لتجربة الحجب)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supervision Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                  <div className="size-10 rounded-2xl bg-purple-100 text-mad-main flex items-center justify-center">
                    <Users className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">إدارة حسابات الأبناء</h3>
                  <p className="text-xs text-gray-600">
                    يمكنك إضافة حساب طفل جديد أو تعديل البيانات ومستوى الصعوبة.
                  </p>
                  <div className="space-y-2 pt-2">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-xs"
                      >
                        <span className="font-bold text-gray-800">{child.name}</span>
                        <span className="text-green-600 font-semibold">حساب نشط</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                  <div className="size-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CreditCard className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">إدارة الاشتراك والدفع</h3>
                  <p className="text-xs text-gray-600">
                    إدارة الفواتير وطرق الدفع وتجديد باقة العائلة.
                  </p>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2 text-xs text-green-800 font-bold">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>الباقة السنوية مفعلة لجميع الأبناء</span>
                  </div>
                </div>
              </div>
            </div>
          </ActiveAccountGuard>
        </div>
      </div>
    </RoleGuard>
  );
}
