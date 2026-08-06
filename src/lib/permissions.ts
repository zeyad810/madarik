export type Permission = "read" | "write" | "admin";

export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes("admin") || userPermissions.includes(required);
}
