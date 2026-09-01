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

  const token = session?.accessToken || session?.token || null;

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

      // Update React Query caches directly for instant UI update
      const rawData: any = data.data || data.child || data;
      const serverStatus =
        rawData?.status || (typeof data.status === "string" ? data.status : null);

      queryClient.setQueryData<Child[]>(
        parentQueryKeys.children(),
        (oldChildren) => {
          if (!Array.isArray(oldChildren)) return oldChildren;
          return oldChildren.map((c) => {
            if (String(c.id) === String(childId)) {
              const nextStatus =
                serverStatus || (c.status === "active" ? "deactivated" : "active");
              return { ...c, status: nextStatus };
            }
            return c;
          });
        }
      );

      queryClient.setQueryData(
        parentQueryKeys.child(childId),
        (oldChild: any) => {
          if (!oldChild) return oldChild;
          const nextStatus =
            serverStatus || (oldChild.status === "active" ? "deactivated" : "active");
          return { ...oldChild, status: nextStatus };
        }
      );

      // Invalidate all parent and child queries in background
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.children() });
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.child(childId) });
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.reports() });
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.childReport(childId) });

      // Update NextAuth session so all views and active accounts reflect the change immediately
      if (session?.user?.children) {
        const currentChildren = session.user.children;
        const updatedChildren = currentChildren.map((c: Child) => {
          if (String(c.id) === String(childId)) {
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

        updateSession({
          ...session,
          user: {
            ...session.user,
            children: updatedChildren,
          },
        }).catch((err) => console.error("[Update session error]:", err));
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
