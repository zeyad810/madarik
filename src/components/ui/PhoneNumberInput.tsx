"use client";

import React, { useState, useRef, useEffect } from "react";
import { Controller, Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber, getCountryCallingCode, Country } from "react-phone-number-input";
import { ChevronDown, Search, Check } from "lucide-react";
import "./PhoneNumberInput.css";

export const ARABIC_COUNTRY_NAMES: Record<string, string> = {
  SA: "السعودية",
  EG: "مصر",
  AE: "الإمارات",
  KW: "الكويت",
  QA: "قطر",
  BH: "البحرين",
  OM: "عُمان",
  JO: "الأردن",
  IQ: "العراق",
  LB: "لبنان",
  SY: "سوريا",
  PS: "فلسطين",
  SD: "السودان",
  LY: "ليبيا",
  TN: "تونس",
  MA: "المغرب",
  DZ: "الجزائر",
  YE: "اليمن",
  US: "الولايات المتحدة",
  GB: "المملكة المتحدة",
  TR: "تركيا",
  DE: "ألمانيا",
  FR: "فرنسا",
  IT: "إيطاليا",
  ES: "إسبانيا",
  CA: "كندا",
};

interface CustomCountrySelectProps {
  value?: Country;
  onChange: (country?: Country) => void;
  options: { value?: Country; label: string }[];
  disabled?: boolean;
  iconComponent: React.ComponentType<{ country: Country; label: string }>;
}

export const SearchableCountrySelect: React.FC<CustomCountrySelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  iconComponent: Icon,
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

  const getDialCode = (countryCode?: Country) => {
    if (!countryCode) return "";
    try {
      return `+${getCountryCallingCode(countryCode)}`;
    } catch {
      return "";
    }
  };

  const getCountryName = (countryCode?: Country, defaultLabel = "") => {
    if (!countryCode) return defaultLabel;
    return ARABIC_COUNTRY_NAMES[countryCode] || defaultLabel;
  };

  const filteredOptions = options.filter((opt) => {
    if (!opt.value) return false;
    const q = searchQuery.toLowerCase().trim();
    const arName = getCountryName(opt.value, opt.label).toLowerCase();
    const enName = opt.label.toLowerCase();
    const dialCode = getDialCode(opt.value);
    const code = opt.value.toLowerCase();

    return arName.includes(q) || enName.includes(q) || dialCode.includes(q) || code.includes(q);
  });

  const selectedDialCode = getDialCode(value);

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
        {value && Icon && (
          <div className="w-5 h-3.5 rounded overflow-hidden shadow-xs flex items-center justify-center">
            <Icon country={value} label={getCountryName(value, value)} />
          </div>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#667085] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Searchable Dropdown Popup */}
      {isOpen && (
        <div
          className="absolute z-50 top-full left-0 mt-2 w-64 max-h-72 bg-white rounded-2xl shadow-xl border border-[#EAECF0] overflow-hidden flex flex-col transition-all duration-200 font-sans"
          dir="rtl"
        >
          {/* Search Box Input */}
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
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-xs text-center text-[#98A2B3]">
                لم يتم العثور على دولة
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const countryCode = opt.value;
                if (!countryCode) return null;
                const isSelected = countryCode === value;
                const dialCode = getDialCode(countryCode);
                const arabicName = getCountryName(countryCode, opt.label);

                return (
                  <button
                    key={countryCode}
                    type="button"
                    onClick={() => {
                      onChange(countryCode);
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
                      <div className="w-5 h-3.5 rounded overflow-hidden shadow-xs shrink-0">
                        <Icon country={countryCode} label={arabicName} />
                      </div>
                      <span className="truncate">{arabicName}</span>
                    </div>

                    <div className="flex items-center gap-2" dir="ltr">
                      <span className="font-mono text-[#667085] text-xs">
                        {dialCode}
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

export interface PhoneNumberInputProps<TFieldValues extends FieldValues = FieldValues> {
  /** Name of the field in React Hook Form */
  name: Path<TFieldValues>;
  /** Control object from React Hook Form `useForm` */
  control: Control<TFieldValues>;
  /** Label text for the phone input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required. Default: false */
  required?: boolean;
  /** Default ISO country code. Default: 'SA' (+966) */
  defaultCountry?: Country;
  /** Custom error message string (overrides RHF field error if provided) */
  error?: string;
  /** Custom helper text below input */
  helperText?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom container wrapper class name */
  className?: string;
  /** Custom RHF rules */
  rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, "validate">;
}

/**
 * Validates an E.164 international phone number using `libphonenumber-js` via `isValidPhoneNumber`.
 * Returns `true` if valid, or a localized error message string if invalid.
 */
export const validatePhoneNumber = (
  value?: string | null,
  required: boolean = false
): boolean | string => {
  const trimmed = value?.trim();

  if (!trimmed) {
    if (required) {
      return "رقم الهاتف مطلوب";
    }
    return true; // Optional field and empty
  }

  if (!isValidPhoneNumber(trimmed)) {
    return "رقم الهاتف غير صحيح للدولة المحددة";
  }

  return true;
};

export function PhoneNumberInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder = "ادخل رقم الهاتف",
  required = false,
  defaultCountry = "SA",
  error: customError,
  helperText,
  disabled = false,
  className = "",
  rules,
}: PhoneNumberInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => validatePhoneNumber(value as string | undefined, required),
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => {
        const activeError = fieldError?.message || customError;

        return (
          <div className={`flex flex-col gap-1.5 text-right w-full font-sans ${className}`} dir="rtl">
            {label && (
              <label htmlFor={name} className="text-sm font-medium text-[#344054]">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
            )}

            <div
              className={`relative flex items-center border rounded-2xl px-3 py-3 bg-white transition-all shadow-xs ${
                activeError
                  ? "border-red-500 focus-within:ring-2 focus-within:ring-red-100"
                  : "border-[#D0D5DD] focus-within:border-[#7F48EF] focus-within:ring-2 focus-within:ring-[#EFECFD]"
              } ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : ""}`}
            >
              <PhoneInput
                id={name}
                international
                countrySelectComponent={SearchableCountrySelect}
                defaultCountry={defaultCountry}
                value={(value as string) || ""}
                onChange={(val) => onChange(val || "")}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full text-right"
              />
            </div>

            {activeError ? (
              <span className="text-xs text-red-500 mt-0.5 font-medium">
                {activeError}
              </span>
            ) : helperText ? (
              <span className="text-xs text-[#667085] mt-0.5 font-normal">
                {helperText}
              </span>
            ) : null}
          </div>
        );
      }}
    />
  );
}

export default PhoneNumberInput;
