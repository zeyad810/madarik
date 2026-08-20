import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { createChild } from "../api";
import { parentQueryKeys } from "../constants";
import type { AddChildPayload, AddChildResponse } from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import type { Child } from "@/types/auth";

export const useAddChild = (
  options?: UseMutationOptions<AddChildResponse, ApiError | Error, AddChildPayload>
) => {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  const token = session?.accessToken ?? null;

  return useMutation<AddChildResponse, ApiError | Error, AddChildPayload>({
    mutationFn: async (payload: AddChildPayload) => {
      console.log("[Add Child Request Payload]:", payload);
      return await createChild(payload, token);
    },
    onSuccess: async (data, variables, context) => {
      console.log("[Add Child Success Response]:", data);
      const successMessage = data.message || "تم إضافة الطفل بنجاح";
      toast.success(successMessage);

      // Invalidate children cache in React Query
      await queryClient.invalidateQueries({
        queryKey: parentQueryKeys.children(),
      });

      // Safely extract and normalize the returned child data
      const rawChild: any = data.data || data.child || data;
      if (rawChild && (rawChild.id || rawChild.name) && session?.user) {
        const newChild: Child = {
          id: String(rawChild.id || Date.now()),
          account_id: String(rawChild.account_id || session.user.id),
          name: rawChild.name || variables.name,
          birth_date: rawChild.birth_date || variables.birth_date,
          gender: rawChild.gender || variables.gender,
          status: rawChild.status || variables.status || "active",
          avatar_img:
            rawChild.avatar_img ||
            rawChild.avatar ||
            variables.avatar_img ||
            variables.avatar ||
            (variables.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png"),
          avatar:
            rawChild.avatar ||
            rawChild.avatar_img ||
            variables.avatar ||
            (variables.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png"),
          user_type: rawChild.user_type || "child",
          created_at: rawChild.created_at || new Date().toISOString(),
          updated_at: rawChild.updated_at || new Date().toISOString(),
          badges_count: rawChild.badges_count ?? 0,
          badges: rawChild.badges ?? 0,
        };

        const currentChildren = session.user.children || [];
        const exists = currentChildren.some((c) => c.id === newChild.id);
        const updatedChildren = exists
          ? currentChildren.map((c) => (c.id === newChild.id ? newChild : c))
          : [...currentChildren, newChild];

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
      console.error("[Add Child Error]:", error);
      const errorMessage = extractAuthErrorMessage(
        error,
        "حدث خطأ أثناء إضافة الطفل. يرجى المحاولة مرة أخرى."
      );
      toast.error(errorMessage);
      if (onError) {
        (onError as any)(error, variables, context);
      }
    },
    ...restOptions,
  });
};
