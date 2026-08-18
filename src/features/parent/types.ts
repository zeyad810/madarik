export interface ManagedChild {
  id: string;
  name: string;
  ageCategory: string; // e.g. "5-9 سنوات", "10-12 سنة", "13-15 سنة"
  avatar: string;
  gender: "male" | "female";
  status: "active" | "inactive";
  birthDate?: string;
  badgesCount?: number;
}
