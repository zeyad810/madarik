import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { resetFirstPassword } from "../api";
import { ResetPasswordPayload, ResetPasswordResponse } from "@/types/auth";
import { ApiError } from "@/types";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

export const useResetFirstPassword = (
  options?: UseMutationOptions<
    ResetPasswordResponse,
    ApiError | Error,
    ResetPasswordPayload
  >
) => {
  const { data: session, update } = useSession();
  const { onSuccess, onError, ...restOptions } = options || {};

  const token = session?.accessToken || (session?.user as any)?.token || null;

  return useMutation<ResetPasswordResponse, ApiError | Error, ResetPasswordPayload>({
    mutationFn: async (payload) => {
      console.log("[Reset First Password Request Payload]:", payload);
      return await resetFirstPassword(payload, token);
    },
    onSuccess: async (data, variables, context) => {
      console.log("[Reset First Password Success Response]:", data);

      // Update NextAuth session so change_by_admin is set to false immediately
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            change_by_admin: false,
          },
        }).catch(() => null);
      }

      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("تم تعيين كلمة المرور الجديدة بنجاح");
      }

      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Reset First Password Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء تعيين كلمة المرور الجديدة"
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
