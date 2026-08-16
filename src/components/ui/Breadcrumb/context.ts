"use client";

import { createContext, useContext } from "react";
import type { BreadcrumbContextValue } from "./types";

export const defaultBreadcrumbContext: BreadcrumbContextValue = {
  variant: "default",
  size: "md",
  separator: "chevron",
  dir: "auto",
};

export const BreadcrumbContext = createContext<BreadcrumbContextValue>(
  defaultBreadcrumbContext
);

export const useBreadcrumbContext = (): BreadcrumbContextValue => {
  return useContext(BreadcrumbContext) ?? defaultBreadcrumbContext;
};
