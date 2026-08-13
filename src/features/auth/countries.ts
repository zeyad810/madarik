export interface Country {
  code: string;
  name: string;
  nameEn: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "EG", name: "مصر", nameEn: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "SA", name: "السعودية", nameEn: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "AE", name: "الإمارات", nameEn: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "KW", name: "الكويت", nameEn: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { code: "QA", name: "قطر", nameEn: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "BH", name: "البحرين", nameEn: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
  { code: "OM", name: "عُمان", nameEn: "Oman", dialCode: "+968", flag: "🇴🇲" },
  { code: "JO", name: "الأردن", nameEn: "Jordan", dialCode: "+962", flag: "🇯🇴" },
  { code: "IQ", name: "العراق", nameEn: "Iraq", dialCode: "+964", flag: "🇮🇶" },
  { code: "LB", name: "لبنان", nameEn: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
  { code: "SY", name: "سوريا", nameEn: "Syria", dialCode: "+963", flag: "🇸🇾" },
  { code: "PS", name: "فلسطين", nameEn: "Palestine", dialCode: "+970", flag: "🇵🇸" },
  { code: "SD", name: "السودان", nameEn: "Sudan", dialCode: "+249", flag: "🇸🇩" },
  { code: "LY", name: "ليبيا", nameEn: "Libya", dialCode: "+218", flag: "🇱🇾" },
  { code: "TN", name: "تونس", nameEn: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
  { code: "MA", name: "المغرب", nameEn: "Morocco", dialCode: "+212", flag: "🇲🇦" },
  { code: "DZ", name: "الجزائر", nameEn: "Algeria", dialCode: "+213", flag: "🇩🇿" },
  { code: "YE", name: "اليمن", nameEn: "Yemen", dialCode: "+967", flag: "🇾🇪" },
  { code: "US", name: "الولايات المتحدة", nameEn: "USA", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "المملكة المتحدة", nameEn: "UK", dialCode: "+44", flag: "🇬🇧" },
  { code: "TR", name: "تركيا", nameEn: "Turkey", dialCode: "+90", flag: "🇹🇷" },
  { code: "DE", name: "ألمانيا", nameEn: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "فرنسا", nameEn: "France", dialCode: "+33", flag: "🇫🇷" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Egypt (+20)
