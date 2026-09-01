"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Loader2,
} from "lucide-react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useParentChildren } from "@/features/parent/hooks/useParentChildren";
import { Child } from "@/types/auth";
import { resolveChildBadgesCount } from "@/lib/children";

export interface SelectChildPromptProps {
  actionType: "read" | "quiz";
  storyId: string;
  storyTitle?: string;
  onSelectChild?: (childId: string) => void;
}

export const SelectChildPrompt: React.FC<SelectChildPromptProps> = ({
  actionType,
  storyId,
  storyTitle,
  onSelectChild,
}) => {
  const { children: sessionChildren, switchAccount } = useActiveAccount();
  const { children: parentChildren, isLoading: isChildrenLoading } = useParentChildren();

  const children =
    parentChildren && parentChildren.length > 0
      ? parentChildren
      : sessionChildren;

  const isQuiz = actionType === "quiz";
  const title = isQuiz
    ? "اختر طفلاً لحل الاختبار"
    : "اختر طفلاً لبدء رحلة القراءة";

  const description = isQuiz
    ? storyTitle
      ? `يرجى اختيار أحد أطفالك لخوض اختبار قصة «${storyTitle}» وتوثيق إنجازه ونقاطه.`
      : "يرجى اختيار أحد أطفالك لخوض هذا الاختبار وتوثيق إنجازه ونقاطه."
    : storyTitle
    ? `يرجى اختيار أحد أطفالك لبدء قراءة قصة «${storyTitle}» ومتابعة تقدمه القرائي.`
    : "يرجى اختيار أحد أطفالك لبدء قراءة هذه القصة ومتابعة تقدمه القرائي.";

  const handleSelect = (child: Child) => {
    switchAccount(child.id, child.user_type);
    onSelectChild?.(child.id);
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white rounded-3xl sm:rounded-4xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10 flex flex-col items-center text-center"
      >
        {/* Top Icon Badge */}
        <div className="relative mb-5">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform ${
              isQuiz
                ? "bg-gradient-to-tr from-[#6D28D9] to-[#9333EA] text-white shadow-purple-200"
                : "bg-gradient-to-tr from-[#7939E3] to-[#A855F7] text-white shadow-purple-200"
            }`}
          >
            {isQuiz ? (
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            ) : (
              <BookOpen className="w-10 h-10 stroke-[2]" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Heading & Description */}
        <h1 className="text-2xl sm:text-3xl font-black text-mad-text-primary mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-mad-text-secondary max-w-xl mb-8 leading-relaxed">
          {description}
        </p>

        {/* Children Grid or Loading / Empty State */}
        {isChildrenLoading && (!children || children.length === 0) ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#7939E3]" />
            <p className="text-sm font-bold">جاري تحميل بيانات الأبناء...</p>
          </div>
        ) : children && children.length > 0 ? (
          <div className="w-full">
            <div className="flex items-center justify-between gap-2 mb-4 px-1">
              <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#7939E3]" />
                <span>أطفالك المسجلين ({children.length})</span>
              </span>
              <Link
                href="/parents/childMangement/addChild"
                className="text-xs sm:text-sm font-bold text-[#7939E3] hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إضافة طفل آخر</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {children.map((child, index) => {
                const isActive = !child.status || child.status === "active";
                const badges = resolveChildBadgesCount(child);
                const avatarSrc =
                  child.avatar_img ||
                  child.avatar ||
                  (child.gender === "female"
                    ? "/assets/girl_avatar.png"
                    : "/assets/boy_avatar.png");

                const ringColor =
                  index % 3 === 0
                    ? "border-blue-200 group-hover:border-blue-400"
                    : index % 3 === 1
                    ? "border-pink-200 group-hover:border-pink-400"
                    : "border-purple-200 group-hover:border-purple-400";

                return (
                  <motion.div
                    key={child.id}
                    whileHover={isActive ? { y: -4, scale: 1.01 } : {}}
                    whileTap={isActive ? { scale: 0.98 } : {}}
                    onClick={() => isActive && handleSelect(child)}
                    className={`group relative w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all flex items-center justify-between gap-4 text-right ${
                      isActive
                        ? "border-slate-200/80 bg-white hover:border-[#7939E3] hover:shadow-lg cursor-pointer"
                        : "border-slate-100 bg-slate-50/70 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {/* Child Info Left */}
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div
                        className={`size-14 sm:size-16 rounded-full border-2 ${ringColor} p-0.5 overflow-hidden shrink-0 bg-purple-50 shadow-inner`}
                      >
                        <Image
                          src={avatarSrc}
                          alt={child.name}
                          width={64}
                          height={64}
                          className="size-full object-cover rounded-full"
                        />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-800 group-hover:text-[#7939E3] transition-colors truncate">
                          {child.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100/80">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span>{badges} وسام</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Tag / Button */}
                    <div className="shrink-0">
                      {isActive ? (
                        <div className="px-4 py-2 rounded-full bg-purple-50 text-[#7939E3] group-hover:bg-[#7939E3] group-hover:text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5">
                          <span>{isQuiz ? "بدء الاختبار" : "بدء القراءة"}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                          معطل
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State: Parent has no children */
          <div className="w-full bg-purple-50/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-[#7939E3] flex items-center justify-center mb-3">
              <UserPlus className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1.5">
              لم تقم بإضافة أي طفل بعد
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
              لتتمكن من قراءة القصص وخوض الاختبارات وتتبع النقاط والأوسمة، يرجى إنشاء حساب لطفلك أولاً.
            </p>
            <Link
              href="/parents/childMangement/addChild"
              className="py-3 px-6 rounded-full bg-[#7939E3] hover:bg-[#6824D6] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة طفل جديد الآن</span>
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="w-full border-t border-slate-100 pt-6 flex items-center justify-center">
          <Link
            href={`/stories/${storyId}`}
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لتفاصيل القصة</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectChildPrompt;
