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
