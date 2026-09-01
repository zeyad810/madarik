import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { updateChild } from "../api";
import { parentQueryKeys } from "../constants";
import type { UpdateChildPayload, UpdateChildResponse } from "../types";
import type { ApiError } from "@/types";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import type { Child } from "@/types/auth";

import { getStoredAuthToken } from "@/lib/auth";

export const useUpdateChild = (
  options?: UseMutationOptions<
    UpdateChildResponse,
    ApiError | Error,
    UpdateChildPayload
  >,
) => {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  return useMutation<UpdateChildResponse, ApiError | Error, UpdateChildPayload>(
    {
      mutationFn: async (payload: UpdateChildPayload) => {
        const resolvedToken = getStoredAuthToken(session);
        return await updateChild(payload, resolvedToken);
      },
      onSuccess: async (data, variables, context) => {
        console.log("[Update Child Success Response]:", data);
        const successMessage = data.message || "تم تحديث بيانات الطفل بنجاح";
        toast.success(successMessage);

        const rawChild: any = data.data || data.child || data;
        const childId = String(variables.id);

        const updatedChild: Child = {
          id: childId,
          account_id: String(session?.user?.id || rawChild?.account_id || ""),
          name: rawChild?.name || variables.name || "",
          birth_date: rawChild?.birth_date || variables.birth_date || "",
          gender: (rawChild?.gender || variables.gender || "male") as "male" | "female",
          status: rawChild?.status || variables.status || "active",
          avatar_img:
            rawChild?.avatar_img ||
            rawChild?.avatar ||
            variables.avatar_img ||
            variables.avatar ||
            (variables.gender === "female"
              ? "/assets/girl_avatar.png"
              : "/assets/boy_avatar.png"),
          avatar:
            rawChild?.avatar ||
            rawChild?.avatar_img ||
            variables.avatar ||
            variables.avatar_img ||
            (variables.gender === "female"
              ? "/assets/girl_avatar.png"
              : "/assets/boy_avatar.png"),
          user_type: rawChild?.user_type || "child",
          created_at: rawChild?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          badges_count: rawChild?.badges_count ?? 0,
          badges: rawChild?.badges ?? 0,
        };

        // Synchronously update query cache for instant feedback
        queryClient.setQueryData<Child[]>(
          parentQueryKeys.children(),
          (oldChildren) => {
            if (!Array.isArray(oldChildren)) return oldChildren;
            return oldChildren.map((c) =>
              String(c.id) === childId ? { ...c, ...updatedChild } : c
            );
          }
        );

        queryClient.setQueryData(
          parentQueryKeys.child(childId),
          (oldChild: any) => {
            return oldChild ? { ...oldChild, ...updatedChild } : updatedChild;
          }
        );

        // Invalidate all parent queries in background to ensure fresh data
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.children() });
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.child(childId) });
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.reports() });
        queryClient.invalidateQueries({ queryKey: parentQueryKeys.childReport(childId) });
        queryClient.invalidateQueries({ queryKey: ["child-reports"] });

        if (session?.user) {
          const currentChildren = session.user.children || [];
          const updatedChildren =
            currentChildren.length > 0
              ? currentChildren.map((c: Child) =>
                  String(c.id) === childId || currentChildren.length === 1
                    ? { ...c, ...updatedChild }
                    : c
                )
              : [updatedChild];

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
        console.error("[Update Child Error]:", error);
        const errorMessage = extractAuthErrorMessage(
          error,
          "حدث خطأ أثناء تحديث بيانات الطفل. يرجى المحاولة مرة أخرى.",
        );
        toast.error(errorMessage);
        if (onError) {
          (onError as any)(error, variables, context);
        }
      },
      ...restOptions,
    },
  );
};

export default useUpdateChild;
