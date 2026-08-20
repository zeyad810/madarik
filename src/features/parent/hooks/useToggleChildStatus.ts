import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { toggleChildStatus } from "../api";
import { parentQueryKeys } from "../constants";
import type { ToggleChildStatusResponse } from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import type { Child } from "@/types/auth";

export interface ToggleChildStatusVariables {
  childId: string;
}

export const useToggleChildStatus = (
  options?: UseMutationOptions<
    ToggleChildStatusResponse,
    ApiError | Error,
    ToggleChildStatusVariables | string
  >,
) => {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  const token = session?.accessToken ?? null;

  return useMutation<
    ToggleChildStatusResponse,
    ApiError | Error,
    ToggleChildStatusVariables | string
  >({
    mutationFn: async (variables) => {
      const childId =
        typeof variables === "string" ? variables : variables.childId;
      return await toggleChildStatus(childId, token);
    },
    onSuccess: async (data, variables, context) => {
      const childId =
        typeof variables === "string" ? variables : variables.childId;
      const successMessage = data.message || "تم تغيير حالة حساب الطفل بنجاح";
      toast.success(successMessage);

      // Invalidate children cache in React Query
      await queryClient.invalidateQueries({
        queryKey: parentQueryKeys.children(),
      });

      // Update NextAuth session so all views and active accounts reflect the change immediately
      if (session?.user?.children) {
        const currentChildren = session.user.children;
        const updatedChildren = currentChildren.map((c: Child) => {
          if (c.id === childId) {
            // Determine new status: from server response data if available, or toggle current
            const rawData: any = data.data || data.child || data;
            const serverStatus =
              rawData?.status ||
              (typeof data.status === "string" ? data.status : null);

            let nextStatus = serverStatus;
            if (!nextStatus) {
              nextStatus = c.status === "active" ? "deactivated" : "active";
            }

            return {
              ...c,
              status: nextStatus,
            };
          }
          return c;
        });

        await updateSession({
          ...session,
          user: {
            ...session.user,
            children: updatedChildren,
          },
        }).catch(() => null);
      }

      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Toggle Child Status Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء تغيير حالة الحساب. يرجى المحاولة مرة أخرى.",
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
