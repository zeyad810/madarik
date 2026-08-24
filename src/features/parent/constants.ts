export const parentQueryKeys = {
  all: ["parent"] as const,
  children: () => [...parentQueryKeys.all, "children"] as const,
  reports: () => [...parentQueryKeys.all, "reports"] as const,
  settings: () => [...parentQueryKeys.all, "settings"] as const,
};

