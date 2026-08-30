import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { deleteChild } from "../api";
import { parentQueryKeys } from "../constants";
import type { DeleteChildResponse } from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import type { Child } from "@/types/auth";

export interface DeleteChildVariables {
  childId: string | number;
}

export const useDeleteChild = (
  options?: UseMutationOptions<
    DeleteChildResponse,
    ApiError | Error,
    DeleteChildVariables | string | number
  >,
) => {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  const token = session?.accessToken || session?.token || null;

  return useMutation<
    DeleteChildResponse,
    ApiError | Error,
    DeleteChildVariables | string | number
  >({
    mutationFn: async (variables) => {
      const childId =
        typeof variables === "object" && variables !== null && "childId" in variables
          ? variables.childId
          : variables;
      return await deleteChild(childId, token);
    },
    onSuccess: async (data, variables, context) => {
      const childId = String(
        typeof variables === "object" && variables !== null && "childId" in variables
          ? variables.childId
          : variables
      );
      const successMessage = data.message || "تم حذف حساب الطفل بنجاح";
      toast.success(successMessage);

      // Invalidate children cache in React Query
      await queryClient.invalidateQueries({
        queryKey: parentQueryKeys.children(),
      });

      // Update NextAuth session if present
      if (session?.user?.children) {
        const updatedChildren = session.user.children.filter(
          (c: Child) => String(c.id) !== childId
        );
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
      console.error("[Delete Child Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء حذف حساب الطفل. يرجى المحاولة مرة أخرى.",
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};

export default useDeleteChild;
