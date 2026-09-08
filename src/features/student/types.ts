export interface StudentSchool {
  id: string;
  created_by?: string;
  name: string;
  code?: string;
  admin_name?: string;
  phone?: string;
  email?: string | null;
  package_id?: string | null;
  activation_start?: string | null;
  activation_end?: string | null;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export interface StudentUser {
  id: string;
  school_id?: string;
  level_id?: string;
  avatar_img?: string | null;
  name: string;
  phone?: string;
  change_by_admin?: boolean;
  temp_password_used_at?: string | null;
  birth_date?: string | null;
  gender?: "male" | "female" | string;
  status?: string;
  last_active_at?: string | null;
  deactivated_by_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  age?: number;
  school?: StudentSchool;
}

export interface StudentProfileData {
  user: StudentUser;
  badges?: any[];
  quiz_attempts?: any[];
}

export interface StudentProfileResponse {
  success: boolean;
  data: StudentProfileData;
  message?: string;
}
