React + Next.js Best Practices & Architecture
Tech Stack Expectations
React 19+
Next.js App Router
TypeScript (strict mode)
TanStack React Query
React Hook Form
Zod
Zustand
Tailwind CSS v4
Lucide React
ESLint & Prettier
General Principles
Follow Clean Code and SOLID principles.
Keep components small and focused on a single responsibility.
Prefer composition over inheritance.
Avoid duplicated code.
Write readable, maintainable, and scalable code.
Strongly type everything.
Never use any unless absolutely unavoidable.
Prefer reusable abstractions over copy-pasting logic.
Separate:
UI
Business logic
Server communication
Client state
Validation
Prefer simple solutions before introducing abstractions.
Do not over-engineer small features.
Follow the existing project architecture and conventions before introducing new patterns.
Components
Component Guidelines
Components should have one clear responsibility.
Make components reusable and composable.
Receive external data through props.
Avoid unnecessary internal state.
Keep components reasonably small, preferably under 150–200 lines.
Move complex logic into custom hooks.
Extract repeated UI patterns into reusable components.
Prefer composition over large components with many configuration props.
Keep business logic out of presentational components.
Components Should NOT

Components should not:

Fetch data directly inside UI render trees.
Make API calls directly from UI components.
Contain complex business logic.
Manage complex forms inline.
Duplicate validation logic.
Duplicate API logic.
Render massive UI trees in a single file.
Store server state in local component state unnecessarily.
Composition

Prefer composition when a component needs flexible content.

Instead of creating many configuration props:

<Card
  showHeader
  showFooter
  headerPosition="top"
  footerPosition="bottom"
/>

Prefer:

<Card>
  <Card.Header />
  <Card.Content />
  <Card.Footer />
</Card>

Use children, render props, slots, or compound components when they provide a clearer API.

Do not introduce complex abstractions when simple props are sufficient.

Compound Components

Use the Compound Component pattern when multiple related components need to work together and the API becomes clearer through composition.

When to Use Compound Components

Consider compound components when:

A component contains multiple related sections.
Consumers need control over the structure or order of those sections.
Several child components share state.
Prop drilling becomes difficult to manage.
The component is accumulating many customization props.
Boolean and positioning props are making the API difficult to understand.
The pattern makes the component easier to extend without modifying the parent API.

For example, instead of:

<Select
  showSearch
  searchPosition="top"
  showIcon
  iconPosition="left"
  showClearButton
/>

Prefer:

<Select>
  <Select.Trigger />
  <Select.Content>
    <Select.Search />
    <Select.Options />
  </Select.Content>
</Select>
Compound Component Responsibilities

The parent component should generally:

Own shared state.
Provide shared context.
Coordinate child components.
Define the overall component behavior.

Child components should:

Have one focused responsibility.
Consume shared state through context when necessary.
Expose meaningful customization points.
Remain independently understandable.

Example:

<Select>
  <Select.Trigger />
  <Select.Content>
    <Select.Search />
    <Select.Options />
  </Select.Content>
</Select>

Internally:

Select
 ├── shared state
 ├── context
 ├── Trigger
 └── Content
      ├── Search
      └── Options
Context With Compound Components

Use React Context when compound components need access to shared state.

Example:

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error(
      "Select compound components must be used inside <Select />"
    );
  }

  return context;
}

The context should:

Be strongly typed.
Be scoped to the compound component.
Avoid exposing unnecessary implementation details.
Throw a useful error when a child is used outside its parent.
Compound Component Decision Rule

Before adding multiple customization props, ask:

Would this API be clearer if consumers could compose the component from smaller related parts?

If yes, consider a compound component.

Use regular props when:

The component is simple.
Customization is limited.
There is no meaningful shared state.
Composition would make usage more complicated.
The pattern would be unnecessary abstraction.
Preferred Decision Order

When designing a reusable component, prefer:

Simple props for simple customization.
Children / composition for flexible content.
Compound components for related composable parts.
Context + compound components when those parts share state.

Do not use Compound Components simply because the pattern exists.

Use it when it improves:

API clarity
composability
scalability
maintainability
extensibility
Data Fetching & Server State
Always use TanStack React Query for server state.
Never fetch data inside useEffect.
Never manually recreate React Query behavior with useState and useEffect.
Use:
useQuery
useSuspenseQuery
useInfiniteQuery
useMutation
React Query should manage:
API requests
Caching
Background refetching
Loading states
Error states
Pagination
Infinite scrolling
Mutations
Cache invalidation
Server synchronization
Server State vs Client State

Server state:

API
 ↓
React Query
 ↓
Components

Client state:

User interaction
 ↓
Zustand / local state
 ↓
Components

Do not copy React Query data into Zustand unless there is a specific architectural reason.

Query Keys

Never hardcode query keys throughout the application.

Create a query-key factory for each domain.

Example:

export const productKeys = {
  all: ["products"] as const,

  lists: () =>
    [...productKeys.all, "list"] as const,

  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,

  details: () =>
    [...productKeys.all, "detail"] as const,

  detail: (id: string | number) =>
    [...productKeys.details(), id] as const,
};

Use:

useQuery({
  queryKey: productKeys.detail(productId),
  queryFn: () => getProduct(productId),
});

Avoid:

queryKey: ["product", productId]

scattered across multiple files.

React Query Hooks

Create reusable hooks for each resource.

Example:

features/products/
├── api/
│   └── products.api.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCreateProduct.ts
│   ├── useUpdateProduct.ts
│   └── useDeleteProduct.ts
├── components/
└── types/

Examples:

useProducts()
useProduct(id)
useCreateProduct()
useUpdateProduct()
useDeleteProduct()

Pages and UI components should not call fetch directly.

API Layer

Create a dedicated API layer.

Each API function should:

Handle one endpoint or closely related operation.
Accept strongly typed parameters.
Return strongly typed data.
Throw normalized errors.
Avoid UI concerns.

Example:

export async function getProduct(
  id: string
): Promise<Product> {
  const response = await api.get<ProductResponse>(
    `/products/${id}`
  );

  return response.data.data;
}

The API layer should not:

Render UI.
Show toast notifications.
Modify React state.
Contain component-specific behavior.
Authentication & Token Handling

Authentication should be designed around the backend contract.

If the backend provides:

Access token
Refresh token
Expiration time
User roles
Permissions

Keep authentication/session state separate from server resource data.

Use:

A centralized fetch-based authentication/request layer for authorization and refresh handling.
React Query for authenticated API data.
Zustand only for client-side session information when required by the architecture.
Next.js middleware/server-side checks where appropriate.

Do not duplicate the same authentication state across:

Zustand
React Query
localStorage
cookies
component state

without a clear reason.

If refresh-token rotation is implemented, ensure concurrent requests do not trigger multiple refresh requests.

Forms

Always use React Hook Form for non-trivial forms.

Avoid managing complex forms with multiple useState calls.

Prefer:

useForm()
Controller
FormProvider
useFormContext

For simple one-input interactions, local state may still be appropriate.

Zod Validation

Use Zod for form validation.

Keep schemas separate from UI components.

Example:

import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginForm = z.infer<typeof loginSchema>;

Use the inferred type instead of manually duplicating the type.

type LoginForm = z.infer<typeof loginSchema>;

Prefer:

features/auth/
├── validation.ts
├── components/
├── hooks/
├── api/
└── types/

Avoid placing large validation schemas directly inside components.

React Hook Form Architecture

For complex forms:

Form
 ├── FormProvider
 ├── BasicInformation
 ├── AddressInformation
 ├── AccountInformation
 └── SubmitButton

Child components should use:

useFormContext()

instead of receiving every form method through props.

Use Controller when integrating controlled third-party components.

State Management

Use the right state solution for the right type of state.

Local React State

Use useState for:

Temporary UI state
Toggle state
Input state when React Hook Form is unnecessary
Component-specific state
Small interactive state
React Query

Use React Query for:

API data
Server state
Cache
Loading states
Error states
Pagination
Mutations
Zustand

Use Zustand for global client state such as:

Authentication/session UI state
Global UI state
Theme
Sidebar state
Modal state
User preferences
Selected filters
Shopping cart state

Do not use Zustand as a replacement for React Query.

Zustand Rules

Keep Zustand stores focused.

Prefer:

stores/
├── auth.store.ts
├── ui.store.ts
└── cart.store.ts

Avoid one giant global store containing unrelated application state.

Do not store large API responses in Zustand just because multiple components need them.

If the data originates from the backend and should be cached/refetched, prefer React Query.

Mutations

Create reusable mutation hooks.

Examples:

useCreateUser()
useUpdateUser()
useDeleteUser()

A mutation should generally:

Call the API layer.
Return typed data.
Handle normalized errors.
Update or invalidate affected queries.
Optionally perform optimistic updates when appropriate.

Example:

const queryClient = useQueryClient();

return useMutation({
  mutationFn: updateProduct,

  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({
      queryKey: productKeys.detail(variables.id),
    });

    queryClient.invalidateQueries({
      queryKey: productKeys.lists(),
    });
  },
});
Cache Invalidation

Invalidate only the queries affected by a mutation.

Avoid:

queryClient.invalidateQueries();

unless intentionally refreshing the entire cache is required.

Prefer:

queryClient.invalidateQueries({
  queryKey: productKeys.lists(),
});

Use optimistic updates when:

The expected result is predictable.
The UX benefits significantly.
Rollback behavior can be implemented safely.
Loading, Empty, Error & Success States

Every data-driven screen should explicitly handle:

Loading
Error
Empty
Success

Example:

if (isLoading) {
  return <ProductListSkeleton />;
}

if (isError) {
  return <ErrorState onRetry={refetch} />;
}

if (!products.length) {
  return <EmptyState />;
}

return <ProductList products={products} />;

Do not hide errors silently.

Do not expose raw backend stack traces to users.

Error Handling

Normalize API errors in one place.

Prefer a predictable application error shape:

interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

Use helper utilities such as:

extractApiError(error)


Next.js App Router

Use the App Router architecture appropriately.

Prefer:

Server Components by default.
Client Components only when client-side functionality is required.
Server-side data fetching when React Query is not required.
Route handlers for backend-for-frontend/API functionality when appropriate.
Server Actions when they provide a clear benefit and fit the application's architecture.

Do not add:

"use client";

to every component unnecessarily.

Server vs Client Components

Use Server Components by default.

Use Client Components when you need:

useState
useEffect
Event handlers
Browser APIs
React Query hooks
Zustand hooks
React Hook Form
Client-side interactivity

Keep client boundaries as small as possible.

Prefer:

Server Component
 └── Client Interactive Component

over turning an entire page into a Client Component unnecessarily.

Next.js Data Fetching

Choose the data-fetching strategy based on the requirement.

For server-rendered data that does not need React Query:

const response = await fetch(url);

For client-side server state:

useQuery(...)

Do not automatically use React Query for every server-side fetch.

The goal is to use the appropriate tool rather than forcing one architecture everywhere.

URL & Search Params State

When state should be shareable, bookmarkable, or represented by the URL, prefer URL search parameters.

Examples:

/products?search=phone&page=2&category=electronics

This is often preferable to keeping the same state exclusively inside Zustand.

Use URL state for:

Search
Pagination
Sorting
Filters
Tabs when appropriate
Styling

Use Tailwind CSS v4.

Avoid inline styles unless dynamic values genuinely require them.

Prefer reusable class utilities.

Example:

className={cn(
  "flex items-center rounded-lg",
  isActive && "bg-primary text-white"
)}

Use a cn() utility for conditional classes.

Avoid massive unreadable class strings when a reusable component would make the UI clearer.

Accessibility

All components should follow accessibility best practices.

Ensure:

Semantic HTML
Keyboard navigation
Visible focus states
Proper labels
Correct button types
Appropriate ARIA attributes
Accessible error messages
Correct heading hierarchy
Sufficient contrast
Screen-reader-friendly status messages

Prefer:

<button>

instead of:

<div onClick={...}>

when the element represents an action.

Responsive Design

Build responsive interfaces using Tailwind breakpoints.

Prefer mobile-first styling:

className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

Avoid excessive breakpoint-specific overrides.

Use reusable responsive components when the same responsive behavior appears repeatedly.

Icons

Use Lucide React for interface icons.

Prefer:

import { Search } from "lucide-react";

Avoid manually creating SVG icons unless a custom icon is required.

Icons should:

Have appropriate accessible labels when interactive.
Be hidden from screen readers when purely decorative.
Match the surrounding visual language.
Naming Conventions

Use explicit and descriptive names.

Components
ProductCard
UserTable
LoginForm
SearchInput
OrderSummary
Hooks
useProducts
useProduct
useCreateProduct
useUpdateProduct
useDeleteProduct
Utilities
formatCurrency
extractApiError
formatDate
normalizePhoneNumber

Avoid vague names:

Helper
Data
Utils2
Component
Stuff
Manager
Thing
File & Feature Organization

Prefer feature-oriented architecture for medium and large applications.

Example:

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── stores/
│   │   ├── types/
│   │   └── validation.ts
│   │
│   ├── products/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── queryKeys.ts
│   │
│   └── orders/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
│   ├── axios.ts
│   ├── query-client.ts
│   └── utils.ts
│
├── hooks/
└── types/

Do not create folders merely to follow this structure.

The architecture should scale with the project.

Reusable UI Components

Reusable components should be:

Focused
Configurable
Accessible
Strongly typed
Composable

Avoid building a universal component with dozens of props.

If a component becomes difficult to configure, consider:

Composition
Children
Slots
Compound Components
Context
TypeScript

Use strict TypeScript.

Prefer explicit domain types.

Avoid:

const data: any = response.data;

Prefer:

const data: ProductResponse = response.data;

Avoid unnecessary type assertions:

value as Product

Fix the underlying type instead when possible.

Prefer discriminated unions for states with different structures.

Example:

type LoginState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; user: User }
  | { status: "error"; message: string };
Constants

Move reusable constants out of components.

Examples:

constants/
├── routes.ts
├── queryKeys.ts
├── permissions.ts
└── config.ts

Do not recreate constant objects on every render unless necessary.

Utilities

Utilities should contain pure, reusable logic.

Good examples:

formatCurrency()
formatDate()
cn()
extractApiError()
normalizePhoneNumber()

Avoid putting business logic into a generic utils.ts file when it belongs to a specific feature.

Prefer:

features/products/utils.ts

over:

utils.ts

when the utility is product-specific.

Performance

Do not optimize prematurely.

First ensure:

Correct architecture
Correct data flow
Proper component boundaries
Proper caching
Minimal unnecessary renders

Use:

React.memo
useMemo
useCallback

only when they solve a demonstrated performance problem or prevent expensive unnecessary work.

Do not wrap every component with memo.

Do not use useMemo and useCallback by default.

React 19 Guidelines

Use React 19 features when they simplify the architecture.

Prefer modern React APIs and patterns where they provide a clear benefit.

Do not introduce new React APIs merely because they are available.

Always consider:

Server Components
Actions
Suspense
Error boundaries
Transitions
Optimistic UI

based on the actual use case.

Accessibility & UX States

Interactive components should provide appropriate feedback.

For async operations:

Idle
 ↓
Loading
 ↓
Success / Error

Buttons that trigger mutations should prevent accidental duplicate submissions when appropriate.

Forms should:

Display field-level errors.
Preserve user input when possible.
Show submission state.
Provide accessible error messages.
Clearly indicate required fields.
Security

Never trust client-side validation alone.

Client-side Zod validation improves UX but does not replace backend validation.

Never expose:

Secrets
Private API keys
Server credentials
Sensitive tokens

through client-side environment variables.

Remember that:

NEXT_PUBLIC_*

variables are exposed to the browser.

Authorization must ultimately be enforced by the backend.

Client-side role checks are for UX, not security.

Roles & Permissions

When permissions come from the backend:

Treat the backend as the source of truth.
Keep permission definitions strongly typed where possible.
Use reusable permission helpers.
Avoid scattering role checks throughout components.

Prefer:

can(user, "products.update")

over:

user.role === "admin"

when the backend provides permission-based authorization.

UI permission checks should not replace backend authorization.

Testing

When tests exist in the project, prioritize testing:

Business logic
API transformations
Validation schemas
Custom hooks
Critical user flows
Complex components

Avoid writing tests that only verify implementation details.

Prefer behavior-based testing.

ESLint & Prettier

Follow the project's ESLint and Prettier configuration.

Do not disable lint rules without a clear reason.

Avoid:

// eslint-disable-next-line

unless the rule genuinely does not apply.

Keep formatting automated.

Code Generation Rules

When generating code:

Follow the existing project architecture.
Use TypeScript strict mode.
Use React 19+ patterns.
Use Next.js App Router conventions.
Prefer Server Components where possible.
Use Client Components only when required.
Use React Query for client-side server state.
Never fetch API data using useEffect.
Create an API layer instead of calling fetch directly from components.
Create query-key factories.
Create reusable React Query hooks.
Use React Hook Form for non-trivial forms.
Use Zod for validation.
Infer types from Zod schemas.
Use Zustand only for global client state.
Never duplicate server state in Zustand.
Normalize API errors.
Handle Loading, Empty, Error, and Success states.
Use Tailwind CSS v4.
Follow accessibility best practices.
Prefer composition over excessive props.
Consider Compound Components when related parts share state or the component API is becoming prop-heavy.
Use Context with Compound Components when shared state would otherwise require prop drilling.
Do not introduce patterns unless they provide a concrete benefit.
Keep components focused and maintainable.
Avoid any.
Avoid unnecessary useMemo, useCallback, and React.memo.
Keep business logic outside presentational components.
Keep authentication and authorization concerns separate from UI.
Follow Clean Code and SOLID principles.
Final Architecture Checklist

Before considering an implementation complete, verify:

Components

Components have a clear single responsibility.

Components are reasonably small.

UI and business logic are separated.

Composition is preferred where appropriate.

Compound Components were considered when the API became prop-heavy.

No unnecessary abstractions were introduced.

Data

Server state uses React Query where appropriate.

No API fetching is implemented through useEffect.

Query keys are centralized.

API calls are isolated in an API layer.

Query hooks are reusable.

Mutations invalidate or update the correct cache.

Forms

React Hook Form is used for non-trivial forms.

Zod handles validation.

Types are inferred from schemas.

Field and submission errors are handled.

Loading/submission state is handled.

State

Local state is used for local concerns.

React Query owns server state.

Zustand owns only global client state.

Server data is not unnecessarily duplicated in Zustand.

URL state is used where appropriate.

TypeScript

No unnecessary any.

API responses are typed.

Function parameters and return values are typed where useful.

Types are reused instead of duplicated.

Type assertions are minimized.

UX

Loading state exists.

Empty state exists.

Error state exists.

Success state exists.

Retry behavior exists where appropriate.

Mutating actions provide feedback.

Accessibility

Semantic HTML is used.

Forms have labels.

Interactive elements are keyboard accessible.

Focus states are visible.

ARIA attributes are used only when necessary.

Errors are accessible to screen readers.

Architecture

Feature boundaries are clear.

Business logic is separated from UI.

API communication is separated from components.

Shared components are actually reusable.

Compound Components are used when they improve API clarity.

No unnecessary global state exists.

No unnecessary client boundaries exist.

Core Principle

Choose the simplest architecture that remains scalable.

Do not blindly apply React Query, Zustand, Context, Compound Components, custom hooks, or abstractions everywhere.

Use each tool for the problem it solves:

UI state
    ↓
React State

Server state
    ↓
TanStack React Query

Global client state
    ↓
Zustand

Complex forms
    ↓
React Hook Form + Zod

API communication
    ↓
Fetch + API Layer

Flexible component composition
    ↓
Children / Composition

Multiple related component parts
    ↓
Compound Components

Shared compound-component state
    ↓
React Context

Server rendering
    ↓
Next.js Server Components

The goal is not to use more patterns.

The goal is to build code that is simple, type-safe, composable, accessible, maintainable, and scalable.
