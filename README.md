# Task Tracker

A full-featured task management application built to practice and demonstrate modern React development patterns, Next.js App Router, TypeScript, and component testing.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5-green)
![Jest](https://img.shields.io/badge/Jest-30-red?logo=jest)

## Features

- Add, toggle, and delete tasks
- Filter tasks by status: All, Active, Done
- Persistent storage using localStorage (survives page reloads)
- SSR-safe hydration with loading state
- Accessible UI with ARIA attributes (`role="tablist"`, `aria-label`, `aria-selected`)
- Responsive layout with DaisyUI components

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Framework with App Router and Server Components |
| **React 19** | UI library with hooks (`useState`, `useEffect`, `useMemo`) |
| **TypeScript** | Static typing with interfaces and type aliases |
| **Tailwind CSS v4** | Utility-first styling via `@tailwindcss/postcss` |
| **DaisyUI 5** | Pre-built component library (`btn`, `checkbox`, `input`, `loading`) |
| **Jest 30** | Test runner with `jsdom` environment |
| **Testing Library** | DOM testing utilities (`render`, `screen`, `fireEvent`) |
| **pnpm** | Package manager |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
p-practice/
├── app/
│   └── page.tsx                        # Server Component — renders <TaskTracker />
├── components/
│   └── tasks/
│       ├── TaskInput.tsx               # "use client" — controlled form to add tasks
│       ├── TaskItem.tsx                # Presentational — renders a single task row
│       ├── TaskList.tsx                # Presentational — maps tasks with empty state
│       ├── TaskFilter.tsx             # "use client" — filter buttons with ARIA roles
│       ├── TaskTracker.tsx            # "use client" — container component (state & logic)
│       └── index.ts                    # Barrel file — re-exports all task components
├── hooks/
│   └── use-local-storage.ts            # Generic localStorage hook with SSR hydration
├── types/
│   └── task.ts                         # Task interface & FilterType union
├── __tests__/
│   └── TaskItem.test.tsx               # Jest component tests
├── jest.config.ts                      # Jest configuration via next/jest
├── jest.setup.ts                       # Mock for crypto.randomUUID
└── package.json                        # Scripts & dependencies
```

## Architecture

### Container / Presentational Pattern

This project separates concerns using the **Container/Presentational** pattern:

```
┌─────────────────────────────────────────────────┐
│  page.tsx (Server Component)                    │
│  └── <TaskTracker />  ← Client Component        │
│       ├── <TaskInput />     addTask              │
│       ├── <TaskFilter />    filter, setFilter    │
│       └── <TaskList />      filteredTasks         │
│           └── <TaskItem />  per task              │
└─────────────────────────────────────────────────┘
```

| Component | Type | `"use client"` | Responsibility |
|-----------|------|---------------|----------------|
| `page.tsx` | Server Component | No | Entry point — renders `<TaskTracker />` with layout |
| `TaskTracker` | Container | **Yes** | State management, business logic, data flow |
| `TaskInput` | Presentational | **Yes** | Form with controlled input, calls `onAddTask` |
| `TaskFilter` | Presentational | **Yes** | Button group with ARIA tabs, calls `onFilterChange` |
| `TaskList` | Presentational | No | Maps tasks to `TaskItem` with empty state |
| `TaskItem` | Presentational | No | Checkbox, title, delete button for one task |

**Why this pattern?** The container (`TaskTracker`) handles all state and logic. Presentational components only receive data and callbacks via props. This makes components easier to test, reuse, and reason about.

### Data Flow

```
User Action → Presentational Component → Callback Prop → TaskTracker → setTasks / setFilter
         ↓                                                     ↓
    TaskInput.onAddTask                              addTask → setTasks([newTask, ...tasks])
    TaskItem.onToggle                                toggleTask → tasks.map(...)
    TaskItem.onDelete                                deleteTask → tasks.filter(...)
    TaskFilter.onFilterChange                        setFilter → useState<FilterType>
```

### State Management

| State | Hook | Persists? | Purpose |
|-------|------|-----------|---------|
| `tasks` | `useLocalStorage<Task[]>` | Yes (localStorage) | Array of all tasks |
| `filter` | `useState<FilterType>` | No (resets on reload) | Current active filter |
| `isLoaded` | Returned by `useLocalStorage` | No | SSR hydration guard |

### Derived Data with `useMemo`

```tsx
// Recalculates only when tasks change
const counts = useMemo(() => ({
  all: tasks.length,
  active: tasks.filter((t) => !t.completed).length,
  completed: tasks.filter((t) => t.completed).length,
}), [tasks]);

// Recalculates only when tasks or filter change
const filteredTasks = useMemo(() => {
  switch (filter) {
    case "active":    return tasks.filter((t) => !t.completed);
    case "completed":  return tasks.filter((t) => t.completed);
    default:           return tasks;
  }
}, [tasks, filter]);
```

**Why `useMemo`?** Without it, these calculations run on every render — even when `tasks` and `filter` haven't changed. `useMemo` caches the result and only recalculates when dependencies change.

### SSR-Safe localStorage Hook

The `useLocalStorage` hook handles a critical Next.js challenge: **`localStorage` doesn't exist on the server**.

```tsx
const [value, setValue] = useState<T>(initValue);     // Start with default
const [isLoaded, setIsLoaded] = useState(false);        // Track hydration

useEffect(() => {
  // Read from localStorage only on the client
  const stored = localStorage.getItem(key);
  if (stored) { /* parse and set state */ }
  setIsLoaded(true);                                    // Mark as hydrated
}, [key]);

if (!isLoaded) {
  return <LoadingSpinner />;                            // Don't render stale data
}
```

**Why `isLoaded`?** Without it, the server renders with `[]` (default) and the client might show stale data or flash empty content. The `isLoaded` flag ensures we wait until localStorage has been read.

## Key Patterns and Decisions

### `"use client"` — When and Why

| Component | `"use client"` | Reason |
|-----------|---------------|--------|
| TaskTracker | **Yes** | Uses `useState`, `useMemo`, and `useLocalStorage` |
| TaskInput | **Yes** | Uses `useState` for controlled input, handles form `onSubmit` |
| TaskFilter | **Yes** | Has `onClick` event handlers on buttons |
| TaskList | No | Pure presentational — receives props, renders JSX |
| TaskItem | No | Pure presentational — receives props, renders JSX |
| page.tsx | No | Server Component — only imports and renders `<TaskTracker />` |

**Rule of thumb:** Add `"use client"` only when a component uses React hooks, event handlers, or browser APIs. A component inside a client boundary inherits the client context automatically, but explicitly declaring it makes the contract self-documenting.

### `import type` for Type-Only Imports

```tsx
import type { Task } from "@/types/task";      // Type-only — erased at build time
import { TaskItem } from "./TaskItem";          // Value import — included in bundle
```

**Why?** `import type` tells the bundler this import only exists at compile time. It gets completely removed from the JavaScript output, improving tree-shaking and preventing accidental runtime usage of types.

### Barrel Exports (`index.ts`)

```ts
export { TaskTracker } from "./TaskTracker";
export { TaskInput } from "./TaskInput";
export { TaskItem } from "./TaskItem";
export { TaskList } from "./TaskList";
export { TaskFilter } from "./TaskFilter";
```

All components are re-exported from a single `index.ts` file. This allows clean imports:

```tsx
import { TaskTracker, TaskInput, TaskList } from "@/components/tasks";
```

Instead of multiple individual imports from different files.

### Accessibility (ARIA)

```tsx
// TaskFilter — tab navigation pattern
<div role="tablist" aria-label="Filter tasks">
  <button role="tab" aria-selected={filter === value}>

// TaskItem — descriptive labels for interactions
<input aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`} />
<button aria-label={`Delete "${task.title}"`}>
```

Screen readers can identify filter tabs and task actions without visual context.

### Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat(ui): add TaskTracker component
fix(deps): approve build scripts msw, sharp & unrs-resolver
chore(config): initial project setup with dependencies and tooling
test(ui): add TaskItem renders task title test
```

| Type | Purpose |
|------|---------|
| `feat` | New feature or component |
| `fix` | Bug fix or configuration correction |
| `chore` | Build, config, or tooling changes |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |

### Trunk-Based Development

Feature branches are created from `master`, developed, and merged back via fast-forward merge:

```
master ──────────────────────────────────
              \                         /
               feat/task-tracker ──────
```

## Testing

Tests use **Jest** with **Testing Library** following the Arrange-Act-Assert pattern:

```tsx
describe("TaskItem", () => {
  it("renders task title", () => {
    // Arrange — prepare mock data
    // Act — render the component
    render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />);

    // Assert — verify the expected behavior
    expect(screen.getByText("test task")).toBeInTheDocument();
  });
});
```

| Utility | Purpose |
|---------|---------|
| `render()` | Mounts a component in a virtual DOM |
| `screen` | Queries elements in the virtual DOM |
| `fireEvent` | Simulates user interactions (clicks, inputs) |
| `jest.fn()` | Creates mock functions to verify callback invocations |
| `getByRole()` | Finds elements by ARIA role (accessible queries) |
| `getByText()` | Finds elements by their text content |
| `toBeInTheDocument()` | Asserts an element exists (from `@testing-library/jest-dom`) |

### Test Configuration

- **`jest.config.ts`** — Uses `next/jest` for full Next.js compatibility
- **`jest.setup.ts`** — Mocks `crypto.randomUUID` for consistent test IDs
- **`testEnvironment: "jsdom"`** — Simulates browser DOM for component testing

## What I Learned

This project served as hands-on practice for:

- **Next.js App Router** — Server Components vs Client Components, the `"use client"` boundary
- **State management** — `useState` for local state, `useMemo` for derived data, custom hooks for persistence
- **SSR hydration** — Handling `localStorage` unavailability on the server with `isLoaded` flag
- **TypeScript** — Interfaces, type aliases, `import type`, generics in custom hooks
- **Component patterns** — Container/Presentational separation, barrel exports, prop drilling
- **Accessibility** — ARIA roles, labels, and selected states
- **Testing** — Jest configuration, component testing with Testing Library, mock functions
- **Git workflow** — Conventional Commits, Trunk-Based Development, feature branches