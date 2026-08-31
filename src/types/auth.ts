export type UserRole =
  "parent" | "child" | "free_customer" | "student" | string;

export interface Child {
  id: string;
  account_id: string;
  name: string;
  birth_date: string;
  gender: string;
  status: string;
  avatar_img?: string | null;
  avatar?: string | null;
  user_type?: string;
  created_at: string;
  updated_at: string;
  badges_count?: number;
  badges?: number;
}

export interface ActiveAccount {
  id: string;
  type: "parent" | "child";
  user_type?: string;
  name: string;
  status?: string;
  gender?: string;
  avatar_img?: string | null;
  avatar?: string | null;
  badges?: number;
  isParent: boolean;
  rawChild?: Child;
  rawParent?: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  change_by_admin?: boolean;
  status: string;
  phone_verified_at: string | null;
  otp_attempts?: number;
  otp_locked_until?: string | null;
  avatar_img?: string | null;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
  children?: Child[];
}

export interface LoginResponse {
  message: string;
  token: string;
  user_type: string;
  user: AuthUser;
  children?: Child[];
  is_subscribed: boolean;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  dev_otp?: string;
}

export interface VerifyRegisterPayload {
  phone: string;
  code?: string;
  otp?: string;
}

export interface VerifyRegisterResponse {
  message?: string;
  token?: string;
  user?: AuthUser;
}

export interface ForgotPasswordPayload {
  phone: string;
}

export interface ForgotPasswordResponse {
  message: string;
  dev_otp?: string | null;
  status?: boolean | string;
}

export interface ResetPasswordPayload {
  password: string;
  password_confirmation?: string;
  confirm_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  phone?: string;
  code?: string;
}

export interface ResetPasswordResponse {
  message: string;
  status?: boolean | string;
  data?: unknown;
}

