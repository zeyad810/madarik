import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
  const user = session?.user;
  const isAuthenticated = status === "authenticated";

  return useQuery<ParentSettingsResponse, ApiError | Error>({
    queryKey: parentQueryKeys.settings(),
    queryFn: async () => {
      // The backend only provides PATCH /account/settings.
      // Current profile/account info is retrieved directly from session.
      return {
        success: true,
        data: {
          name: user?.name ?? undefined,
          phone: user?.phone ?? undefined,
          avatar: user?.avatar_img || user?.avatar || undefined,
          avatar_img: user?.avatar_img || user?.avatar || undefined,
        },
      };
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
    initialData: user
      ? {
          success: true,
          data: {
            name: user.name ?? undefined,
            phone: user.phone ?? undefined,
            avatar: user.avatar_img || user.avatar || undefined,
            avatar_img: user.avatar_img || user.avatar || undefined,
          },
        }
      : undefined,
    staleTime: Infinity,
    ...options,
  });
};

export default useParentSettings;
