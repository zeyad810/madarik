import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../api";
import { ForgotPasswordPayload, ForgotPasswordResponse } from "@/types/auth";
import { ApiError } from "@/types";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

export const useForgotPassword = (
  options?: UseMutationOptions<
    ForgotPasswordResponse,
    ApiError | Error,
    ForgotPasswordPayload
  >
) => {
  const { onSuccess, onError, ...restOptions } = options || {};

  return useMutation<ForgotPasswordResponse, ApiError | Error, ForgotPasswordPayload>({
    mutationFn: async (payload) => {
      console.log("[Forgot Password Request Payload]:", payload);
      return await forgotPassword(payload);
    },
    onSuccess: (data, variables, context) => {
      console.log("[Forgot Password Success Response]:", data);
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("تم إرسال رمز التحقق بنجاح");
      }
      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Forgot Password Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء إرسال رمز التحقق"
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
