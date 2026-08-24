import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { updateParentPassword } from "../api";
import type {
  UpdateParentPasswordPayload,
  UpdateParentPasswordResponse,
} from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";

export const useUpdateParentPassword = (
  options?: UseMutationOptions<
    UpdateParentPasswordResponse,
    ApiError | Error,
    UpdateParentPasswordPayload
  >
) => {
  const { data: session } = useSession();
  const { onSuccess, onError, ...restOptions } = options || {};

  const token = session?.accessToken ?? null;

  return useMutation<
    UpdateParentPasswordResponse,
    ApiError | Error,
    UpdateParentPasswordPayload
  >({
    mutationFn: async (payload: UpdateParentPasswordPayload) => {
      console.log("[Update Parent Password Request]:", {
        hasCurrent: !!payload.current_password || !!payload.currentPassword,
        hasNew: !!payload.new_password || !!payload.newPassword,
      });
      return await updateParentPassword(payload, token);
    },
    onSuccess: (data, variables, context) => {
      console.log("[Update Parent Password Success Response]:", data);
      const successMessage = data.message || "تم تغيير كلمة المرور بنجاح";
      toast.success(successMessage);

      if (onSuccess) {
        (onSuccess as any)(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("[Update Parent Password Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية والمحاولة مرة أخرى."
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};

export default useUpdateParentPassword;
