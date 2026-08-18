"use client";

import React, { useState } from "react";
import { X, Plus, User, Calendar, Sparkles } from "lucide-react";
import { ManagedChild } from "../types";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChild: (newChild: Omit<ManagedChild, "id">) => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  onAddChild,
}) => {
  const [name, setName] = useState("");
  const [ageCategory, setAgeCategory] = useState("5-9 سنوات");
  const [gender, setGender] = useState<"male" | "female">("male");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddChild({
      name: name.trim(),
      ageCategory,
      gender,
      avatar: gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png",
      status: "active",
    });

    setName("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-6 top-6 size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 text-mad-main font-bold text-lg mb-1">
          <Sparkles className="size-5" />
          <h2>إضافة طفل جديد</h2>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          أدخل بيانات طفلك لإنشاء ملف قراءة مخصص وتتبع مستواه.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Child Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              اسم الطفل
            </label>
            <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50/50 focus-within:border-mad-main focus-within:bg-white transition-all">
              <User className="size-4.5 text-gray-400 ml-2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم الطفل"
                className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Age Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              الفئة العمرية
            </label>
            <div className="relative flex items-center border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50/50 focus-within:border-mad-main focus-within:bg-white transition-all">
              <Calendar className="size-4.5 text-gray-400 ml-2" />
              <select
                value={ageCategory}
                onChange={(e) => setAgeCategory(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 cursor-pointer"
              >
                <option value="5-9 سنوات">5-9 سنوات (المستوى التأسيسي)</option>
                <option value="10-12 سنة">10-12 سنة (المستوى المتوسط)</option>
                <option value="13-15 سنة">13-15 سنة (المستوى المتقدم)</option>
              </select>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              الجنس
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  gender === "male"
                    ? "border-mad-main bg-purple-50 text-mad-main ring-2 ring-mad-main/20"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
                }`}
              >
                ولد 👦
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  gender === "female"
                    ? "border-mad-main bg-purple-50 text-mad-main ring-2 ring-mad-main/20"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
                }`}
              >
                بنت 👧
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="size-4.5 stroke-[2.5]" />
              <span>إضافة الطفل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
