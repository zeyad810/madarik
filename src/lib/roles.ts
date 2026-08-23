/**
 * Normalizes a role string (handles English and Arabic aliases, underscores, dashes, spaces)
 * using a switch-case pattern.
 */
export function normalizeRole(role: string): string {
  const clean = role.trim().toLowerCase().replace(/[-_\s]+/g, "_");

  switch (clean) {
    case "parent":
    case "parents":
    case "ولي_امر":
    case "ولي_أمر":
    case "ولي_الأمر":
    case "ولي_الامر":
      return "parent";

    case "free":
    case "free_customer":
    case "free_user":
    case "عميل_مجاني":
    case "عميل":
    case "مجاني":
      return "free_customer";

    case "student":
    case "students":
    case "طالب":
    case "طلاب":
      return "student";

    case "child":
    case "children":
    case "طفل":
    case "اطفال":
    case "أطفال":
      return "child";

    case "admin":
    case "administrator":
    case "مشرف":
    case "مسؤول":
      return "admin";

    default:
      return clean;
  }
}

/**
 * Checks whether a user's role matches any of the allowed roles.
 */
export function hasRoleAccess(userRole: string | undefined | null, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedAllowed = allowedRoles.map(normalizeRole);

  return (
    normalizedAllowed.includes(normalizedUserRole) ||
    allowedRoles.map((r) => r.toLowerCase().trim()).includes(userRole.toLowerCase().trim())
  );
}

/**
 * Checks whether a role corresponds to a student.
 */
export function isStudentRole(role: string | undefined | null): boolean {
  if (!role) return false;
  return normalizeRole(role) === "student";
}


