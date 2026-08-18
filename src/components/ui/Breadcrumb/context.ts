"use client";

import { createContext, useContext } from "react";
import type { BreadcrumbContextValue } from "./types";
import { DEFAULT_BREADCRUMB_CONTEXT } from "./constants";

export const defaultBreadcrumbContext: BreadcrumbContextValue = DEFAULT_BREADCRUMB_CONTEXT;

export const BreadcrumbContext = createContext<BreadcrumbContextValue>(
  defaultBreadcrumbContext
);

export const useBreadcrumbContext = (): BreadcrumbContextValue => {
  return useContext(BreadcrumbContext) ?? defaultBreadcrumbContext;
};
