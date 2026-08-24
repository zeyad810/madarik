import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getParentSettings } from "../api";
import { parentQueryKeys } from "../constants";
import type { ParentSettingsResponse } from "../types";
import type { ApiError } from "@/types";

export const useParentSettings = (
  options?: Omit<
    UseQueryOptions<ParentSettingsResponse, ApiError | Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? null;
  const isAuthenticated = status === "authenticated";

  return useQuery<ParentSettingsResponse, ApiError | Error>({
    queryKey: parentQueryKeys.settings(),
    queryFn: async () => {
      return await getParentSettings(token);
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    ...options,
  });
};

export default useParentSettings;
