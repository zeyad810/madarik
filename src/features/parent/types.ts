import { Child } from "@/types/auth";

export interface ManagedChild {
  id: string;
  name: string;
  ageCategory: string; // e.g. "5-9 سنوات", "10-12 سنة", "13-15 سنة"
  avatar: string;
  avatar_img?: string | null;
  gender: "male" | "female";
  status: "active" | "inactive" | "deactivated" | string;
  birthDate?: string;
  badgesCount?: number;
}

export interface AddChildPayload {
  name: string;
  birth_date: string;
  gender: "male" | "female";
  status?: "active" | "inactive" | "deactivated" | string;
  avatar?: string | null;
  avatar_img?: string | null;
  avatarFile?: File | null;
}

export interface AddChildResponse {
  success?: boolean;
  message?: string;
  data?: Child;
  child?: Child;
}

export interface ParentChildrenResponse {
  success?: boolean;
  message?: string;
  data?: Child[];
}

export interface UpdateChildPayload {
  id: string | number;
  name: string;
  birth_date: string;
  gender: "male" | "female";
  status?: "active" | "inactive" | "deactivated" | string;
  avatar?: string | null;
  avatar_img?: string | null;
  avatarFile?: File | null;
}

export interface UpdateChildResponse {
  success?: boolean;
  message?: string;
  data?: Child;
  child?: Child;
}

export interface ToggleChildStatusResponse {
  success?: boolean;
  message?: string;
  data?: Child | { id: string; status: string; [key: string]: unknown };
  child?: Child;
  status?: string;
}

export interface SingleChildResponse {
  success?: boolean;
  message?: string;
  data?: Child;
  child?: Child;
}

export interface DeleteChildResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export interface ParentSettingsPayload {
  name: string;
  phone?: string;
  notifications_enabled?: boolean;
}

export interface ParentSettingsData {
  id?: string | number;
  name?: string;
  phone?: string;
  notifications_enabled?: boolean;
  avatar?: string | null;
  avatar_img?: string | null;
  [key: string]: unknown;
}

export interface ParentSettingsResponse {
  success?: boolean;
  message?: string;
  data?: ParentSettingsData;
}

export interface UpdateParentPasswordPayload {
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  password_confirmation?: string;
  confirm_password?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}




export interface UpdateParentPasswordResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

// =========================================================================

// Child Reports Interfaces (Based on API response)
// =========================================================================

export interface ReadingActivityStory {
  id: string;
  title: string;
}

export interface ReadingActivity {
  id: string;
  child_id: string;
  student_id?: string | null;
  school_student_id?: string | null;
  story_id: string;
  started_at: string;
  finished_at?: string | null;
  story?: ReadingActivityStory;
}

export interface QuizDetails {
  id: string;
  code?: string;
  story_id?: string;
  passing_score?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  story?: ReadingActivityStory;
}

export interface QuizAttempt {
  id: string;
  child_id: string;
  student_id?: string | null;
  school_student_id?: string | null;
  quiz_id: string;
  score: number;
  highest_score: number;
  last_score?: number;
  last_score_percentage?: number;
  highest_score_percentage?: number;
  passing_score_percentage?: number;
  total_count: number;
  attempt_number: number;
  completed_at?: string;
  duration_seconds?: number;
  created_at?: string;
  updated_at?: string;
  quiz?: QuizDetails;
  story?: ReadingActivityStory;
}

export interface UserBadge {
  id?: string;
  badge_id?: string;
  child_id?: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string | null;
  icon?: string | null;
  earned_at?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ChildReportItem {
  id: string;
  account_id: string;
  avatar_img?: string | null;
  avatar?: string | null;
  name: string;
  birth_date: string;
  gender: "male" | "female" | string;
  status: "active" | "deactivated" | "inactive" | string;
  created_at: string;
  updated_at: string;
  quizzes_count: number;
  average_score: number;
  stories_read_count: number;
  badges_count: number;
  user_type: "child" | string;
  reading_activities: ReadingActivity[];
  quiz_attempts: QuizAttempt[];
  user_badges: UserBadge[];
}

export interface ChildReportsResponse {
  success: boolean;
  message?: string;
  data: ChildReportItem[];
}

export interface SingleChildReportResponse {
  success?: boolean;
  message?: string;
  data?: ChildReportItem;
  report?: ChildReportItem;
}

export interface QuizResultRow {
  id: string;
  storyTitle: string;
  story?: ReadingActivityStory;
  level: string;
  resultScore: number;
  attemptsCount: number;
  lastScore: number;
  highestScore: number;
  maxScore: number;
}

export interface ReadingHistoryRow {
  id: string;
  storyTitle: string;
  story?: ReadingActivityStory;
  dateText: string;
  durationMinutes: number;
  status: "completed" | "in_progress";
}


