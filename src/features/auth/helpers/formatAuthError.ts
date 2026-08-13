import { ApiError } from "@/types";

export const extractAuthErrorMessage = (
  error: unknown,
  fallbackMessage: string = "حدث خطأ غير متوقع أثناء العملية"
): string => {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  if ((error as ApiError)?.message) {
    return (error as ApiError).message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as { message?: string; response?: { data?: { message?: string } } };
    if (errObj.response?.data?.message) {
      return errObj.response.data.message;
    }
    if (errObj.message) {
      return errObj.message;
    }
  }

  return fallbackMessage;
};
