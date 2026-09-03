"use client";

import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { subscribeNewsletter } from "../api";
import type { SubscribeNewsletterPayload, SubscribeNewsletterResponse } from "../types";
import type { ApiError } from "@/types";

export type SubscribeNewsletterMutationOptions = UseMutationOptions<
  SubscribeNewsletterResponse,
  ApiError | Error,
  SubscribeNewsletterPayload
>;

export const useSubscribeNewsletter = (
  options?: SubscribeNewsletterMutationOptions
): UseMutationResult<
  SubscribeNewsletterResponse,
  ApiError | Error,
  SubscribeNewsletterPayload
> => {
  return useMutation<SubscribeNewsletterResponse, ApiError | Error, SubscribeNewsletterPayload>({
    mutationFn: (payload: SubscribeNewsletterPayload) => subscribeNewsletter(payload),
    ...options,
  });
};
