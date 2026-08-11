export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]> | string[];
  statusCode?: number;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse | null;

  constructor(message: string, status: number = 500, data: ApiErrorResponse | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


export interface SectionHeaderProps {
  title?: string;
  description?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  align?: "center" | "start" | "end";
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}