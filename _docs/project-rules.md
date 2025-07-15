# Word Rush: Project & Code Conventions

This document outlines the definitive rules and conventions for the Word Rush project. Adhering to these guidelines is mandatory to ensure we build a codebase that is modular, scalable, clean, and easy for both human and AI developers to understand and maintain.

## 1. Core Philosophy: AI-First Development

Our primary goal is to create an "AI-first" codebase. This means:
-   **Modularity**: Code is broken down into small, single-responsibility modules.
-   **Clarity**: Code is self-documenting, with clear naming and explicit types.
-   **Navigability**: A strict and logical file structure makes it easy to find any piece of code.
-   **Scalability**: The architecture is designed to grow without becoming overly complex.

## 2. Directory Structure

We will use a monorepo structure managed by npm/yarn/pnpm workspaces. This keeps our frontend, backend, and shared code separate but managed within a single repository.

```
/
├── docs/                 # All project documentation (.md files)
│   ├── project-brief.md
│   ├── project-overview.md
│   ├── tech-stack.md
│   ├── theme-rules.md
│   ├── ui-rules.md
│   └── user-flow.md
├── packages/
│   ├── client/           # The React + Phaser frontend application
│   │   ├── public/       # Static assets (index.html, favicon)
│   │   └── src/
│   │       ├── assets/       # Images, fonts, audio files
│   │       ├── components/   # React components
│   │       ├── context/      # React Context providers
│   │       ├── game/         # Phaser-specific code (scenes, game objects)
│   │       ├── hooks/        # Custom React hooks
│   │       ├── services/     # Client-side logic (e.g., socket service)
│   │       ├── styles/       # Global CSS and theme setup
│   │       └── main.tsx      # Application entry point
│   ├── server/           # The Express + Socket.io backend server
│   │   └── src/
│   │       ├── api/          # Express routes
│   │       ├── config/       # Server configuration
│   │       ├── game/         # Core game logic (state, validation)
│   │       ├── services/     # Business logic services
│   │       └── index.ts      # Server entry point
│   └── common/             # Code shared between client and server
│       └── src/
│           └── types/        # Shared TypeScript types and interfaces
├── package.json          # Root package.json for workspace management
└── tsconfig.json         # Root TypeScript configuration
```

## 3. File & Directory Naming Conventions

-   **Directories**: `kebab-case` (e.g., `game-logic`, `ui-components`).
-   **React Components**: `PascalCase` (e.g., `PlayerAvatar.tsx`).
-   **Hooks**: `useCamelCase` (e.g., `useSocket.ts`).
-   **All Other `.ts` / `.tsx` files**: `kebab-case` (e.g., `game-state.ts`, `socket-handler.ts`).

## 4. Code Style & Rules

### File Structure & Documentation
-   **File Header**: Every `.ts` and `.tsx` file must begin with a TSDoc block comment that explains the file's purpose and contents.
-   **Function Documentation**: Every function must be preceded by a TSDoc block comment detailing its purpose, all parameters (`@param`), and what it returns (`@returns`).
-   **File Length**: No file may exceed 500 lines. This is a strict rule to enforce modularity.

### Language & Patterns
-   **Functional Programming**: We will use functional and declarative patterns. Avoid `class` syntax entirely.
-   **Immutability**: Data structures should be treated as immutable. Use non-mutating methods (e.g., `.map`, `.filter`, spread syntax) instead of mutating data in place.
-   **Pure Functions**: Use the `function` keyword for pure functions. For other functions (e.g., those with side effects), use arrow function syntax.
-   **Type Safety**:
    -   TypeScript's `strict` mode must be enabled.
    -   Avoid `any` at all costs. Use `unknown` for data from external sources and perform runtime validation (e.g., with `zod`).
-   **Error Handling**: Throw descriptive errors. Do not return `null` or fallback values to hide problems. All asynchronous operations must have `.catch()` handlers.
-   **Variable Naming**: Use descriptive names that clarify intent. For booleans, use auxiliary verbs (e.g., `isLoading`, `hasError`, `canSubmit`).
-   **Enums**: Do not use TypeScript `enum`. Use object literals with `as const` for type-safe, string-based alternatives.
-   **Concise Syntax**:
    -   Use ternary operators for simple conditional assignments.
    -   Avoid unnecessary curly braces for single-line statements in conditionals.
    -   Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate.

## 5. Commit Message Conventions

We will follow the **Conventional Commits** specification. This creates a clean and informative Git history. Each commit message should be structured as follows:

`<type>[optional scope]: <description>`

-   **Common types**:
    -   `feat`: A new feature for the user.
    -   `fix`: A bug fix for the user.
    -   `docs`: Changes to documentation only.
    -   `style`: Formatting, missing semi-colons, etc.; no code logic change.
    -   `refactor`: A code change that neither fixes a bug nor adds a feature.
    -   `test`: Adding missing tests or correcting existing tests.
    -   `chore`: Updating build tasks, package manager configs, etc. 