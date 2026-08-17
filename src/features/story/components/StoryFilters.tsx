"use client";

import React from "react";
import { StoryFilterType } from "../types";

interface StoryFiltersProps {
  activeTab: StoryFilterType;
  onTabChange: (tab: StoryFilterType) => void;
  availableAges: string[];
  selectedAge: string;
  onAgeChange: (age: string) => void;
  availableLevels: string[];
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

export const StoryFilters: React.FC<StoryFiltersProps> = ({
  activeTab,
  onTabChange,
  availableAges,
  selectedAge,
  onAgeChange,
  availableLevels,
  selectedLevel,
  onLevelChange,
}) => {
  return (
    <div dir="rtl" className="w-full flex flex-col items-start gap-4 mb-8">
      {/* Primary Filter Tabs Aligned to Right (in RTL) */}
      <div className="inline-flex items-center bg-[#F4F4F6] p-1.5 rounded-full shadow-inner border border-slate-200/60">
        <button
          type="button"
          onClick={() => onTabChange("all")}
          className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
            activeTab === "all"
              ? "bg-[#7939E3] text-white shadow-md"
              : "text-[#64748B] hover:text-[#1E293B]"
          }`}
        >
          الكل
        </button>

        <button
          type="button"
          onClick={() => onTabChange("age")}
          className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
            activeTab === "age"
              ? "bg-[#7939E3] text-white shadow-md"
              : "text-[#64748B] hover:text-[#1E293B]"
          }`}
        >
          حسب الفئة العمرية
        </button>

        <button
          type="button"
          onClick={() => onTabChange("level")}
          className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
            activeTab === "level"
              ? "bg-[#7939E3] text-white shadow-md"
              : "text-[#64748B] hover:text-[#1E293B]"
          }`}
        >
          حسب المستوى
        </button>
      </div>

      {/* Secondary Age Chips if age tab is selected */}
      {activeTab === "age" && availableAges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => onAgeChange("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
              selectedAge === "all"
                ? "bg-purple-100 text-[#7939E3] border-[#7939E3]"
                : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
            }`}
          >
            جميع الفئات
          </button>
          {availableAges.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => onAgeChange(age)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                selectedAge === age
                  ? "bg-purple-100 text-[#7939E3] border-[#7939E3]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      )}

      {/* Secondary Level Chips if level tab is selected */}
      {activeTab === "level" && availableLevels.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => onLevelChange("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
              selectedLevel === "all"
                ? "bg-purple-100 text-[#7939E3] border-[#7939E3]"
                : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
            }`}
          >
            جميع المستويات
          </button>
          {availableLevels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onLevelChange(lvl)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                selectedLevel === lvl
                  ? "bg-purple-100 text-[#7939E3] border-[#7939E3]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryFilters;
