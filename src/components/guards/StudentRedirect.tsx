"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { isStudentRole } from "@/lib/roles";

/**
 * StudentRedirect automatically redirects authenticated student accounts to the stories page.
 * Suitable for placement on landing/marketing pages or other non-student pages.
 */
export function StudentRedirect() {
  const router = useRouter();
  const { user_type, userRole, isStudent, isAuthenticated, isLoading } = useActiveAccount();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const currentRole = user_type || userRole;
      if (isStudent || isStudentRole(currentRole)) {
        router.push("/stories");
      }
    }
  }, [isLoading, isAuthenticated, isStudent, user_type, userRole, router]);

  return null;
}

export default StudentRedirect;
