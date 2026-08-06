---
name: react-next-best-practices
description: Expert Senior Frontend Engineer guidelines for React 19+, Next.js (App Router), TypeScript, TanStack React Query, React Hook Form, Zod, Zustand, and Axios best practices.
---

# React + Next.js Best Practices & Architecture

## Tech Stack Expectations

* **React 19+**
* **Next.js App Router**
* **TypeScript** (strict mode)
* **TanStack React Query**
* **React Hook Form**
* **Zod**
* **Zustand**
* **Axios**
* **Tailwind CSS**
* **Lucide React**
* **ESLint & Prettier**

---

## General Principles

* Follow **Clean Code** and **SOLID** principles.
* Keep components small and focused on a single responsibility.
* Prefer composition over inheritance.
* Avoid duplicated code.
* Write readable, maintainable, and scalable code.
* Strongly type everything. Never use `any` unless absolutely unavoidable.
* Prefer reusable abstractions over copy-pasting logic.
* Separate UI, business logic, server communication, and state management.

---

## Components

### Component Guidelines:
* Have **one single responsibility**.
* Be reusable and composable.
* Receive data through props.
* Avoid unnecessary internal state.
* Stay reasonably small (~150–200 lines maximum).
* Move complex logic into custom hooks.

### What Components Should NOT Do:
* Fetch data directly inside UI render trees.
* Manage complex forms inline.
* Handle complex business logic.
* Render massive UI trees in a single file.

---

## Data Fetching & Server State

* Always use **TanStack React Query** for server state.
* **Never fetch data inside `useEffect`**.
* Use `useQuery`, `useInfiniteQuery`, `useSuspenseQuery`, or `useMutation`.
* React Query must manage:
  * API requests
  * Caching
  * Background refetching
  * Pagination & Infinite scrolling
  * Loading and Error states
  * Cache invalidation

---

## Query Keys

* **Never hardcode query keys.**
* Always centralize query keys into factory objects per domain resource.

```ts
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
};
```

---

## React Query Hooks & API Layer

* Create reusable custom hooks for every resource (`useProducts()`, `useProduct(id)`, `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()`).
* Pages and UI components should **never call Axios directly**.
* Create a dedicated API layer where each function handles one endpoint, returns typed data, and throws typed errors.
* Use a single shared Axios instance with configured base URL, authorization headers, interceptors, error normalization, and token refresh.

---

## Forms & Validation

* Always use **React Hook Form**. Never build forms using multiple `useState` hooks.
* Use `useForm`, `Controller`, `FormProvider`, and `useFormContext` for nested components.
* Always validate forms using **Zod**.
* Infer TypeScript types directly from Zod schemas:
  ```ts
  type LoginForm = z.infer<typeof loginSchema>;
  ```
* Keep validation schemas in separate validation files (e.g. `validation.ts`).

---

## State Management Rules

* **React Query** manages:
  * Server data & cache
  * API loading & error states
  * CRUD mutations & pagination
* **Zustand** manages **global client state** ONLY:
  * Authentication session state
  * Global UI state (theme, sidebar, modals)
  * User preferences & selected filters
  * Shopping cart state
* **Do not duplicate server data in Zustand.**

---

## Mutations & Cache Invalidation

* Create reusable mutation hooks (`useCreateUser()`, `useUpdateUser()`, `useDeleteUser()`).
* Always invalidate affected query keys on successful mutations (`queryClient.invalidateQueries(...)`).
* Handle optimistic updates when beneficial to user experience.
* Normalize and format API errors.

---

## Error & Loading Handling

* Every screen should properly handle:
  * **Loading state** (Skeleton / Spinner)
  * **Empty state**
  * **Error state** (User-friendly message, retry trigger)
  * **Success state**
* Never swallow errors silently or expose raw server traces to users.

---

## Styling & Accessibility

* Use **Tailwind CSS**. Avoid inline styles.
* Extract repeated class combinations into reusable components or helper utilities (`cn(...)`).
* Always use semantic HTML tags (`<main>`, `<nav>`, `<header>`, `<article>`).
* Ensure keyboard navigation, focus management, labels, and proper ARIA attributes.

---

## Naming Conventions

* Use explicit, descriptive names:
  * Components: `ProductCard`, `UserTable`, `LoginForm`
  * Hooks: `useProducts`, `useUpdateProduct`
  * Utilities: `formatCurrency`, `extractApiError`
* Avoid vague names like `Helper`, `Data`, `Utils2`, `Component`, `Stuff`.

---

## Code Generation Checklist

1. Build reusable, single-responsibility components.
2. Separate business logic from UI using custom hooks.
3. Use React Query for all server data.
4. Use React Hook Form + Zod for form state & validation.
5. Use Zustand exclusively for global client state.
6. Strongly type everything; avoid `any`.
7. Explicitly handle Loading, Empty, Error, and Success states.
8. Follow accessibility & Clean Code standards.
