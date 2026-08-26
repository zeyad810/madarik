"use client";

import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { sendContactMessage } from "../api";
import type { SendContactPayload, SendContactResponse } from "../types";
import type { ApiResponse, ApiError } from "@/types";

export type SendContactMutationOptions = UseMutationOptions<
  ApiResponse<SendContactResponse | null>,
  ApiError | Error,
  SendContactPayload
>;

export const useSendContactMessage = (
  options?: SendContactMutationOptions
): UseMutationResult<
  ApiResponse<SendContactResponse | null>,
  ApiError | Error,
  SendContactPayload
> => {
  return useMutation<ApiResponse<SendContactResponse | null>, ApiError | Error, SendContactPayload>({
    mutationFn: (payload: SendContactPayload) => sendContactMessage(payload),
    ...options,
  });
};
