import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { toggleAccountStatus } from "../api";
import type { AccountToggleResponse } from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import { clearStoredAuth } from "@/lib/auth";
import { useActiveAccount } from "@/hooks/useActiveAccount";

export const useToggleAccountStatus = (
  options?: UseMutationOptions<
    AccountToggleResponse,
    ApiError | Error,
    void
  >
) => {
  const { data: session } = useSession();
  const { resetAccount } = useActiveAccount();
  const { onSuccess, onError, ...restOptions } = options || {};

  const sessionObj = session as (Record<string, unknown> & { accessToken?: string; token?: string }) | null | undefined;
  const token = session?.accessToken || sessionObj?.token || null;

  return useMutation<AccountToggleResponse, ApiError | Error, void>({
    mutationFn: async () => {
      return await toggleAccountStatus(token);
    },
    onSuccess: async (data, variables, context) => {
      const successMessage = data?.message || "تم تعطيل الحساب بنجاح";
      toast.success(successMessage);

      // 1. Reset active account and clear auth tokens from local storage & cookies
      resetAccount();
      clearStoredAuth();

      if (onSuccess) {
        onSuccess(data, variables, context);
      }

      // 2. Log out the user and redirect to home
      await signOut({ callbackUrl: "/" });
    },
    onError: (error, variables, context) => {
      console.error("[Toggle Account Status Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء تعطيل الحساب. يرجى المحاولة مرة أخرى."
      );
      toast.error(errorMessage);
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...restOptions,
  });
};

export default useToggleAccountStatus;
