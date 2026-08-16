export interface Child {
  id: string;
  account_id: string;
  name: string;
  birth_date: string;
  gender: string;
  status: string;
  created_at: string;
  updated_at: string;
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
  otp: string;
}

export interface VerifyRegisterResponse {
  message?: string;
  token?: string;
  user?: AuthUser;
}
