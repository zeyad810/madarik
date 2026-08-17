export interface StoryBlock {
  id: string;
  order: number;
  block_type: "text" | "image" | string;
  content: string;
}

export interface Story {
  id: string;
  code: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  cover_photo_url: string | null;
  level: string | null;
  outcome: string | null;
  indicator: string | null;
  age_category: string | null;
  availability: "free" | "paid" | string;
  pdf_url: string | null;
  blocks?: StoryBlock[];
  created_at?: string;
  updated_at?: string;
  lesson_learned?: string | null;
  total_pages?: number | null;
}

export interface FreeStoriesResponse {
  success: boolean;
  message: string;
  data: Story[];
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
