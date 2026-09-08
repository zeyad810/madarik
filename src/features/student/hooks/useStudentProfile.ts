"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { getStoredAuthToken } from "@/lib/auth";
import { getStudentProfile } from "../api";
import type { StudentProfileResponse } from "../types";

export const studentQueryKeys = {
  all: ["student"] as const,
  profile: () => [...studentQueryKeys.all, "profile"] as const,
  results: () => [...studentQueryKeys.all, "results"] as const,
};

export const useStudentProfile = () => {
  const { data: session, status } = useSession();
  const { isStudent } = useActiveAccount();
  const token = getStoredAuthToken(session);

  return useQuery<StudentProfileResponse, Error>({
    queryKey: studentQueryKeys.profile(),
    queryFn: async () => {
      return await getStudentProfile(token);
    },
    enabled: status === "authenticated" && !!token && isStudent,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export default useStudentProfile;
