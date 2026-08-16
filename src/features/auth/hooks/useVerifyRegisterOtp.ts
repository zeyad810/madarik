import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { verifyRegisterOtp } from "../api";
import { VerifyRegisterPayload, VerifyRegisterResponse } from "@/types/auth";
import { ApiError } from "@/types";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

export const useVerifyRegisterOtp = (
  options?: UseMutationOptions<
    VerifyRegisterResponse,
    ApiError | Error,
    VerifyRegisterPayload
  >
) => {
  const { onSuccess, onError, ...restOptions } = options || {};

  return useMutation<VerifyRegisterResponse, ApiError | Error, VerifyRegisterPayload>({
    mutationFn: async (payload) => {
      console.log("[Verify OTP Request Payload]:", payload);
      return await verifyRegisterOtp(payload);
    },
    onSuccess: (data, variables, context) => {
      console.log("[Verify OTP Success Response]:", data);
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("تم التحقق وتأكيد الحساب بنجاح");
      }
      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Verify OTP Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "رمز التحقق غير صحيح أو منتهي الصلاحية"
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
