import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { resetPassword } from "../api";
import { ResetPasswordPayload, ResetPasswordResponse } from "@/types/auth";
import { ApiError } from "@/types";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

export const useResetPassword = (
  options?: UseMutationOptions<
    ResetPasswordResponse,
    ApiError | Error,
    ResetPasswordPayload
  >
) => {
  const { onSuccess, onError, ...restOptions } = options || {};

  return useMutation<ResetPasswordResponse, ApiError | Error, ResetPasswordPayload>({
    mutationFn: async (payload) => {
      console.log("[Reset Password Request Payload]:", payload);
      return await resetPassword(payload);
    },
    onSuccess: (data, variables, context) => {
      console.log("[Reset Password Success Response]:", data);
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("تم إعادة تعيين كلمة المرور بنجاح");
      }
      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Reset Password Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء إعادة تعيين كلمة المرور"
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
