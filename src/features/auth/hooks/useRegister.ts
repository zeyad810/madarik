import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { registerUser } from "../api";
import { RegisterPayload, RegisterResponse } from "@/types/auth";
import { ApiError } from "@/types";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

export const useRegister = (
  options?: UseMutationOptions<RegisterResponse, ApiError | Error, RegisterPayload>
) => {
  const { onSuccess, onError, ...restOptions } = options || {};

  return useMutation<RegisterResponse, ApiError | Error, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data, variables, context) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("تم إنشاء الحساب وإرسال رمز التحقق بنجاح");
      }
      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ غير متوقع أثناء إنشاء الحساب"
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
