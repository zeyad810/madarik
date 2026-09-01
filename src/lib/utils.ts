export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Computes the Arabic age category from a birth date string.
 * Returns: "5-9 سنوات" | "10-12 سنة" | "13-15 سنة"
 */
export function getAgeCategoryFromBirthDate(birthDateStr?: string): string {
  if (!birthDateStr) return "5-9 سنوات";
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return "5-9 سنوات";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 10) return "5-9 سنوات";
  if (age <= 12) return "10-12 سنة";
  return "13-15 سنة";
}

/**
 * Calculates a child's age in Arabic formatted string from a birth date.
 * Examples: "أقل من سنة", "سنة واحدة", "سنتان", "5 سنوات", "12 سنة"
 */
export function calculateAgeInArabic(birthDateStr?: string): string {
  if (!birthDateStr) return "";
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) return "";
  if (age === 0) return "أقل من سنة";
  if (age === 1) return "سنة واحدة";
  if (age === 2) return "سنتان";
  if (age >= 3 && age <= 10) return `${age} سنوات`;
  return `${age} سنة`;
}

/**
 * Derives child grade and age string (e.g. "الصف الثالث • 8 سنوات")
 */
export function getChildGradeAndAge(birthDateStr?: string): string {
  if (!birthDateStr) return "";
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) return "";

  const grades: Record<number, string> = {
    4: "الروضة",
    5: "الروضة",
    6: "الصف الأول",
    7: "الصف الثاني",
    8: "الصف الثالث",
    9: "الصف الرابع",
    10: "الصف الخامس",
    11: "الصف السادس",
    12: "الصف الأول الإعدادي",
    13: "الصف الثاني الإعدادي",
    14: "الصف الثالث الإعدادي",
    15: "الصف الأول الثانوي",
  };

  const ageStr = calculateAgeInArabic(birthDateStr);
  const gradeStr = grades[age];

  if (gradeStr && ageStr) {
    return `${gradeStr} • ${ageStr}`;
  }
  return gradeStr || ageStr || "";
}

/**
 * Formats relative activity time in Arabic
 */
export function formatArabicActivityTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "نشط الآن";
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 5) return "نشط الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  if (diffHours === 1) return "منذ ساعة";
  if (diffHours === 2) return "منذ ساعتين";
  if (diffHours < 24) return `منذ ${diffHours} ساعات`;
  if (diffDays === 1) return "منذ يوم";
  if (diffDays === 2) return "منذ يومين";
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;
  return `منذ ${diffDays} يوماً`;
}

/**
 * Formats a date string into readable Arabic format (e.g. "15 فبراير 2026").
 */
export function formatArabicDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const trimmed = String(dateStr).trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "-";
  // If already in Arabic formatted text (contains Arabic letters), return as is
  if (/[\u0600-\u06FF]/.test(trimmed)) return trimmed;

  const date = new Date(trimmed);
  if (isNaN(date.getTime())) return trimmed;

  try {
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return trimmed;
  }
}

