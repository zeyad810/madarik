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

import { useActiveAccount } from "@/hooks/useActiveAccount";
import { isFreeRole } from "@/lib/roles";

export const useUpdateChild = (
  options?: UseMutationOptions<
    UpdateChildResponse,
    ApiError | Error,
    UpdateChildPayload
  >,
) => {
  const { data: session, update: updateSession } = useSession();
  const { isFreeCustomer, sessionUserType, user_type } = useActiveAccount();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};

  const isFree =
    isFreeCustomer ||
    isFreeRole(sessionUserType) ||
    isFreeRole(session?.user_type) ||
    isFreeRole((session?.user as any)?.user_type) ||
    isFreeRole(user_type) ||
    session?.is_subscribed === false;

  return useMutation<UpdateChildResponse, ApiError | Error, UpdateChildPayload>(
    {
      mutationFn: async (payload: UpdateChildPayload) => {
        const resolvedToken =
          session?.accessToken ||
          session?.token ||
          (session?.user as any)?.accessToken ||
          (session?.user as any)?.token ||
          null;
        console.log(
          "[Update Child Request Payload]:",
          payload,
          "isFree:",
          isFree,
          "Has Token:",
          !!resolvedToken
        );
        return await updateChild(payload, resolvedToken, isFree);
      },
      onSuccess: async (data, variables, context) => {
        console.log("[Update Child Success Response]:", data);
        const successMessage = data.message || "تم تحديث بيانات الطفل بنجاح";
        toast.success(successMessage);

        // Safely extract and normalize the returned child data to update session & cache
        const rawChild: any = data.data || data.child || data;
        const childId = String(variables.id);

        // Invalidate or directly update React Query cache
        if (isFree) {
          queryClient.setQueryData<Child[]>(["free", "child"], (old) => {
            const current: any = (old && old[0]) || (session?.user?.children && session.user.children[0]) || {};
            const updated: Child = {
              id: String(rawChild?.id || childId || current.id || "free-child"),
              account_id: String(rawChild?.account_id || current.account_id || session?.user?.id || ""),
              name: rawChild?.name || variables.name || current.name || "",
              birth_date: rawChild?.birth_date || variables.birth_date || current.birth_date || "",
              gender: (rawChild?.gender || variables.gender || current.gender || "male") as "male" | "female",
              status: rawChild?.status || variables.status || current.status || "active",
              avatar_img:
                rawChild?.avatar_img ||
                rawChild?.avatar ||
                current.avatar_img ||
                current.avatar ||
                (variables.gender === "female"
                  ? "/assets/girl_avatar.png"
                  : "/assets/boy_avatar.png"),
              avatar:
                rawChild?.avatar ||
                rawChild?.avatar_img ||
                current.avatar ||
                current.avatar_img ||
                (variables.gender === "female"
                  ? "/assets/girl_avatar.png"
                  : "/assets/boy_avatar.png"),
              user_type: rawChild?.user_type || current.user_type || "child",
              created_at: rawChild?.created_at || current.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              badges_count: rawChild?.badges_count ?? current.badges_count ?? 0,
              badges: rawChild?.badges ?? current.badges ?? 0,
            };
            return [updated];
          });
          await queryClient.invalidateQueries({ queryKey: ["free", "child"] });
        } else {
          await queryClient.invalidateQueries({
            queryKey: parentQueryKeys.children(),
          });
        }

        if (session?.user) {
          const currentChildren = session.user.children || [];
          const updatedChild: Child = {
            id: childId,
            account_id: String(session.user.id),
            name: rawChild?.name || variables.name,
            birth_date: rawChild?.birth_date || variables.birth_date,
            gender: (rawChild?.gender || variables.gender || "male") as "male" | "female",
            status: rawChild?.status || variables.status || "active",
            avatar_img:
              rawChild?.avatar_img ||
              rawChild?.avatar ||
              (variables.gender === "female"
                ? "/assets/girl_avatar.png"
                : "/assets/boy_avatar.png"),
            avatar:
              rawChild?.avatar ||
              rawChild?.avatar_img ||
              (variables.gender === "female"
                ? "/assets/girl_avatar.png"
                : "/assets/boy_avatar.png"),
            user_type: "child",
            created_at: rawChild?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

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
