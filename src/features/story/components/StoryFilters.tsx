"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryAvailabilityFilter, StoryFilterType } from "../types";

interface StoryFiltersProps {
  activeTab: StoryFilterType;
  onTabChange: (tab: StoryFilterType) => void;
  availableLevels: string[];
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  selectedAvailability: StoryAvailabilityFilter;
  onAvailabilityChange: (availability: StoryAvailabilityFilter) => void;
}

export const StoryFilters: React.FC<StoryFiltersProps> = ({
  activeTab,
  onTabChange,
  availableLevels,
  selectedLevel,
  onLevelChange,
  selectedAvailability,
  onAvailabilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availabilityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        availabilityDropdownRef.current &&
        !availabilityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAvailabilityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLevel = (level: string) => {
    onLevelChange(level);
    onTabChange("level");
    setIsOpen(false);
  };

  const handleSelectAvailability = (availability: StoryAvailabilityFilter) => {
    onAvailabilityChange(availability);
    setIsAvailabilityOpen(false);
  };

  const handleAllClick = () => {
    onTabChange("all");
    onLevelChange("all");
    onAvailabilityChange("all");
    setIsOpen(false);
    setIsAvailabilityOpen(false);
  };

  // Label text for level tab button
  const levelButtonLabel =
    activeTab === "level" && selectedLevel !== "all"
      ? selectedLevel
      : "حسب المستوى";

  const availabilityButtonLabel =
    selectedAvailability === "free"
      ? "مجانية"
      : selectedAvailability === "paid"
        ? "مدفوعة"
        : "حسب النوع";

  return (
    <div dir="rtl" className="w-full flex flex-wrap items-center justify-start gap-4 mb-8">
      {/* Primary Filter Tabs Bar */}
      <div className="inline-flex items-center bg-[#F4F4F6] p-1.5 rounded-full shadow-inner border border-slate-200/60 relative gap-4">
        {/* Tab 1: الكل */}
        <button
          type="button"
          onClick={handleAllClick}
          className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
            activeTab === "all" && selectedAvailability === "all"
              ? "bg-[#7939E3] text-white shadow-md"
              : "text-mad-text-secondary hover:text-mad-text-primary"
          }`}
        >
          الكل
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setIsAvailabilityOpen(false);
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
              activeTab === "level"
                ? "bg-[#7939E3] text-white shadow-md"
                : "text-mad-text-secondary hover:text-mad-text-primary"
            }`}
          >
            <span>{levelButtonLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              } ${activeTab === "level" ? "text-white" : "text-slate-400"}`}
            />
          </button>

          {/* Animated Dropdown Menu directly under the Level tab */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full mt-2.5 right-0 z-50 min-w-52 bg-white rounded-2xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-purple-100/80 flex flex-col gap-1 backdrop-blur-md"
              >
                {/* Option 1: جميع المستويات */}
                <button
                  type="button"
                  onClick={() => handleSelectLevel("all")}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-right cursor-pointer select-none ${
                    selectedLevel === "all" && activeTab === "level"
                      ? "bg-purple-50 text-[#7939E3]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>جميع المستويات</span>
                  {selectedLevel === "all" && activeTab === "level" && (
                    <Check className="w-4 h-4 text-[#7939E3] shrink-0" />
                  )}
                </button>

                <div className="h-px bg-slate-100 my-0.5" />

                {/* Available Levels */}
                {availableLevels.map((lvl) => {
                  const isSelected =
                    activeTab === "level" && selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSelectLevel(lvl)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-right cursor-pointer select-none ${
                        isSelected
                          ? "bg-purple-50 text-[#7939E3]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{lvl}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#7939E3] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative" ref={availabilityDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsAvailabilityOpen((prev) => !prev);
              setIsOpen(false);
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
              selectedAvailability !== "all"
                ? "bg-[#7939E3] text-white shadow-md"
                : "text-mad-text-secondary hover:text-mad-text-primary"
            }`}
            aria-label="تصفية القصص حسب النوع"
          >
            <span>{availabilityButtonLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isAvailabilityOpen ? "rotate-180" : ""
              } ${
                selectedAvailability !== "all"
                  ? "text-white"
                  : "text-slate-400"
              }`}
            />
          </button>

          <AnimatePresence>
            {isAvailabilityOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full mt-2.5 right-0 z-50 min-w-44 bg-white rounded-2xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-purple-100/80 flex flex-col gap-1 backdrop-blur-md"
              >
                {([
                  ["all", "كل الأنواع"],
                  ["free", "مجانية"],
                  ["paid", "مدفوعة"],
                ] as const).map(([value, label]) => {
                  const isSelected = selectedAvailability === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSelectAvailability(value)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-right cursor-pointer select-none ${
                        isSelected
                          ? "bg-purple-50 text-[#7939E3]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#7939E3] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StoryFilters;
