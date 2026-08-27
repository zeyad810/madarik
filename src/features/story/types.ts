export interface StoryBlock {
  id: string;
  order: number;
  block_type: "text" | "image" | string;
  content: string;
}

export interface StoryLevel {
  id: string;
  name: string;
  age_from?: number;
  age_to?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StoryOutcome {
  id: string;
  level_id?: string;
  name: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StoryIndicator {
  id: string;
  outcome_id?: string;
  name: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StoryQuiz {
  id: string;
  code: string;
  story_id: string;
  passing_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  code: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  cover_photo_url: string | null;
  level_id?: string | null;
  outcome_id?: string | null;
  indicator_id?: string | null;
  level?: StoryLevel | string | null;
  outcome?: StoryOutcome | string | null;
  indicator?: StoryIndicator | string | null;
  age_category: string | null;
  availability: "free" | "paid" | string;
  status?: string;
  pdf_url: string | null;
  pdf_size_bytes?: number | null;
  created_by?: string;
  blocks?: StoryBlock[];
  created_at?: string;
  updated_at?: string;
  lesson_learned?: string | null;
  total_pages?: number | null;
  quiz_id?: string | null;
  quiz?: StoryQuiz | null;
}

export const getStoryQuizId = (story?: Story | null): string | null => {
  if (!story) return null;
  if (typeof story.quiz_id === "string" && story.quiz_id.trim()) {
    return story.quiz_id.trim();
  }
  if (story.quiz && typeof story.quiz === "object" && story.quiz.id) {
    return story.quiz.id;
  }
  return null;
};

export const getStoryLevelName = (
  level?: StoryLevel | string | null,
  fallback: string = "الأول"
): string => {
  if (!level) return fallback;
  if (typeof level === "object" && "name" in level) return level.name || fallback;
  if (typeof level === "string") return level || fallback;
  return fallback;
};

export const getStoryOutcomeName = (
  outcome?: StoryOutcome | string | null,
  fallback: string = "توثيق مهارات"
): string => {
  if (!outcome) return fallback;
  if (typeof outcome === "object" && "name" in outcome) return outcome.name || fallback;
  if (typeof outcome === "string") return outcome || fallback;
  return fallback;
};

export const getStoryIndicatorName = (
  indicator?: StoryIndicator | string | null,
  fallback: string = "يحدد الفكرة الرئيسية"
): string => {
  if (!indicator) return fallback;
  if (typeof indicator === "object" && "name" in indicator) return indicator.name || fallback;
  if (typeof indicator === "string") return indicator || fallback;
  return fallback;
};

export interface StoryPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export interface FreeStoriesResponse {
  success: boolean;
  message?: string;
  data: Story[];
  pagination?: StoryPaginationMeta;
}

export interface StoryDetailResponse {
  success: boolean;
  message?: string;
  data: Story;
}

export type StoryFilterType = "all" | "age" | "level";

export interface StoryFiltersState {
  filterType: StoryFilterType;
  selectedAge?: string;
  selectedLevel?: string;
}

export interface FinishStoryPayload {
  child_id?: string | null;
  student_id?: string | null;
  started_at?: string;
  finished_at?: string;
}

export interface FinishStoryResponse {
  success?: boolean;
  message?: string;
  data?: any;
}

