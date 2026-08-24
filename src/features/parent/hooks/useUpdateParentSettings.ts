import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { updateParentSettings } from "../api";
import { parentQueryKeys } from "../constants";
import type { ParentSettingsPayload, ParentSettingsResponse } from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";

export const useUpdateParentSettings = (
  options?: UseMutationOptions<
    ParentSettingsResponse,
    ApiError | Error,
    ParentSettingsPayload
  >
) => {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  const token = session?.accessToken ?? null;

  return useMutation<ParentSettingsResponse, ApiError | Error, ParentSettingsPayload>({
    mutationFn: async (payload: ParentSettingsPayload) => {
      console.log("[Update Parent Settings Request Payload]:", payload);
      return await updateParentSettings(payload, token);
    },
    onSuccess: async (data, variables, context) => {
      console.log("[Update Parent Settings Success Response]:", data);
      const successMessage = data.message || "تم حفظ التعديلات بنجاح";
      toast.success(successMessage);

      // Optimistically update settings cache
      queryClient.setQueryData<ParentSettingsResponse>(parentQueryKeys.settings(), (old) => {
        const currentData = old?.data || {};
        return {
          ...old,
          success: true,
          data: {
            ...currentData,
            name: variables.name || currentData.name,
            ...(variables.notifications_enabled !== undefined
              ? { notifications_enabled: variables.notifications_enabled }
              : {}),
          },
        };
      });

      // Invalidate settings query cache in React Query
      await queryClient.invalidateQueries({
        queryKey: parentQueryKeys.settings(),
      });

      // Update session so all components reading from session/activeAccount update immediately
      if (session) {
        try {
          await updateSession({
            ...session,
            name: variables.name || session.user?.name,
            user: {
              ...session.user,
              name: variables.name || session.user?.name,
            },
          });
        } catch (err) {
          console.error("[Update session error]:", err);
        }
      }


      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Update Parent Settings Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى."
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};

export default useUpdateParentSettings;
