export const parentQueryKeys = {
  all: ["parent"] as const,
  children: () => [...parentQueryKeys.all, "children"] as const,
  child: (id: string | number) => [...parentQueryKeys.all, "child", String(id)] as const,
  reports: () => [...parentQueryKeys.all, "reports"] as const,
  childReport: (id: string | number) => [...parentQueryKeys.all, "child-report", String(id)] as const,
  settings: () => [...parentQueryKeys.all, "settings"] as const,
  subscriptionHistory: () => [...parentQueryKeys.all, "subscription-history"] as const,
};

