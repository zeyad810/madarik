export const parentQueryKeys = {
  all: ["parent"] as const,
  children: () => [...parentQueryKeys.all, "children"] as const,
};
