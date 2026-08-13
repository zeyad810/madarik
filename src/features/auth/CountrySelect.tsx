"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { COUNTRIES, Country } from "./countries";

interface CountrySelectProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  disabled?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  selectedCountry,
  onSelectCountry,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter((country) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      country.name.toLowerCase().includes(q) ||
      country.nameEn.toLowerCase().includes(q) ||
      country.dialCode.includes(q) ||
      country.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 border-l border-[#EAECF0] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
        dir="ltr"
        aria-label="Select Country Code"
      >
        <span className="text-lg leading-none">{selectedCountry.flag}</span>
        <span className="text-sm font-semibold text-[#344054] font-sans">
          {selectedCountry.dialCode}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#667085] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 top-full left-0 mt-2 w-64 max-h-72 bg-white rounded-2xl shadow-xl border border-[#EAECF0] overflow-hidden flex flex-col transition-all duration-200 font-sans"
          dir="rtl"
        >
          {/* Search Box */}
          <div className="p-2 border-b border-[#EAECF0] bg-gray-50/50">
            <div className="relative flex items-center bg-white border border-[#D0D5DD] rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-[#98A2B3] shrink-0 ml-2" />
              <input
                type="text"
                placeholder="ابحث عن دولة أو كود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-[#101828] bg-transparent outline-none placeholder:text-[#98A2B3]"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 p-1 space-y-0.5 max-h-52 custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="px-3 py-4 text-xs text-center text-[#98A2B3]">
                لم يتم العثور على دولة
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onSelectCountry(country);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#F4EBFF] text-[#6941C6] font-semibold"
                        : "hover:bg-gray-50 text-[#344054]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>

                    <div className="flex items-center gap-2" dir="ltr">
                      <span className="font-mono text-[#667085] text-xs">
                        {country.dialCode}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#6941C6]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
