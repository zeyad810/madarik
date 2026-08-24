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

  const token = session?.accessToken || session?.token || null;

  return useMutation<UpdateChildResponse, ApiError | Error, UpdateChildPayload>(
    {
      mutationFn: async (payload: UpdateChildPayload) => {
        console.log("[Update Child Request Payload]:", payload);
        return await updateChild(payload, token);
      },
      onSuccess: async (data, variables, context) => {
        console.log("[Update Child Success Response]:", data);
        const successMessage = data.message || "تم تحديث بيانات الطفل بنجاح";
        toast.success(successMessage);

        // Invalidate children cache in React Query
        await queryClient.invalidateQueries({
          queryKey: parentQueryKeys.children(),
        });

        // Safely extract and normalize the returned child data to update session
        const rawChild: any = data.data || data.child || data;
        const childId = String(variables.id);

        if (session?.user?.children) {
          const currentChildren = session.user.children;
          const updatedChildren = currentChildren.map((c: Child) => {
            if (c.id === childId) {
              return {
                ...c,
                name: rawChild?.name || variables.name,
                birth_date: rawChild?.birth_date || variables.birth_date,
                gender: rawChild?.gender || variables.gender,
                status: rawChild?.status || variables.status || c.status,
                avatar_img:
                  rawChild?.avatar_img ||
                  rawChild?.avatar ||
                  c.avatar_img ||
                  c.avatar ||
                  (variables.gender === "female"
                    ? "/assets/girl_avatar.png"
                    : "/assets/boy_avatar.png"),
                avatar:
                  rawChild?.avatar ||
                  rawChild?.avatar_img ||
                  c.avatar ||
                  c.avatar_img ||
                  (variables.gender === "female"
                    ? "/assets/girl_avatar.png"
                    : "/assets/boy_avatar.png"),
                updated_at: new Date().toISOString(),
              };
            }
            return c;
          });

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
