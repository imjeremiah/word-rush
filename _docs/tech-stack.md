# Word Rush: Technology Stack

This document outlines the official technology stack for the Word Rush project. This stack has been chosen to meet all project requirements while prioritizing simplicity, rapid development, and a modern developer experience, in line with the project's core challenge.

## Frontend

### 1. UI Framework: React

- **Role**: To build the non-game user interface, including the main menu, game lobby, settings panels, and leaderboards.
- **Why**: React's component-based architecture is the industry standard for creating scalable and maintainable UIs. It will live alongside the Phaser canvas, managing the application's shell.

#### Usage & Best Practices

- **Component Structure**: Use functional components with Hooks (`useState`, `useEffect`, etc.). Keep components small and focused on a single responsibility.
- **Data Flow**: Maintain a strict unidirectional data flow. State should be passed down from parent to child components via props.
- **Performance**: Use `React.memo` for components that render frequently with the same props. Use `useCallback` and `useMemo` to memoize functions and values to prevent unnecessary re-renders.
- **Pitfall**: Avoid "prop-drilling" (passing props through many layers of components). For global state, use the Context API.

### 2. Client-Side State Management: React Context API

- **Role**: To manage and share global UI state across different components.
- **Why**: It's built directly into React, providing a simple, out-of-the-box solution for sharing data like the player's username, server connection status, and current game state without adding the complexity of an external state management library.

#### Usage & Best Practices

- **Scope**: Use Context for low-frequency, global state (e.g., theme, session info, authentication status).
- **Granularity**: Create multiple, specific contexts rather than a single monolithic one. This prevents components from re-rendering due to unrelated state changes.
- **Limitation**: Context is not optimized for high-frequency updates (like real-time game scores). Doing so will cause significant performance issues. High-frequency data should be piped directly from Socket.io to the components that need it.

### 3. Game Engine: Phaser 3

- **Role**: To render and manage the core gameplay experience, including the letter grid, tile animations, and player input on the game board.
- **Why**: Phaser is a powerful and mature 2D game framework for the web, perfectly suited for the tile-based, high-performance gameplay we need to achieve.

#### Usage & Best Practices

- **Scene Management**: Use Scenes to break up the game into logical states (e.g., `PreloaderScene`, `MainMenuScene`, `GameScene`, `UIScene`). The `UIScene` can run concurrently on top of the `GameScene` for HUD elements.
- **Asset Optimization**: Use texture atlases to reduce the number of HTTP requests and optimize GPU memory usage.
- **Separation of Concerns**: The core game logic should be managed by Phaser. The surrounding UI (menus, lobbies) should be managed by React. They should communicate via a well-defined interface or event bus, but not directly manipulate each other.
- **Pitfall**: Do not try to build complex forms or menus within Phaser. Use the DOM (and React) for what it's good at.

### 4. Build Tool: Vite

- **Role**: To bundle our frontend code (TypeScript, React components) and provide a fast development server.
- **Why**: Vite offers a significantly faster and simpler developer experience compared to alternatives like Webpack. Its near-zero configuration and instant server startups will accelerate our development process.

#### Usage & Best Practices

- **Development Proxy**: Use Vite's built-in proxy feature in `vite.config.ts` to forward backend API requests from the React client to the Express server during development, avoiding CORS issues.
- **Environment Variables**: Use `.env` files and `import.meta.env` to manage environment-specific variables.
- **Consideration**: Be aware that Vite uses `esbuild` for its dev server and `Rollup` for production builds. While this is rarely an issue, it can lead to "works in dev, breaks in prod" bugs if you encounter an edge case.

## Backend

### 5. Backend Framework: Express.js

- **Role**: To provide the structure for our server, handle HTTP requests, and manage the Socket.io instance.
- **Why**: Express is the minimal, flexible, and battle-tested standard for Node.js, giving us a solid foundation for our authoritative game server.

#### Usage & Best Practices

- **Middleware**: Use middleware for cross-cutting concerns like logging, authentication, and error handling. Use security middleware like `helmet` and `cors`.
- **Structure**: Organize the application into modules (e.g., `routes`, `services`, `game-logic`).
- **Error Handling**: Implement a centralized error-handling middleware to ensure consistent error responses and prevent leaking stack traces.
- **Pitfall**: Avoid blocking the event loop with long-running, synchronous code. Use asynchronous operations for I/O and heavy computation.

### 6. Real-time Networking: Socket.io

- **Role**: To manage the persistent, real-time, bi-directional communication between the server and all connected players.
- **Why**: It's the industry standard for building real-time web applications, handling the complexities of WebSockets to ensure low-latency multiplayer gameplay.

#### Usage & Best Practices

- **Authoritative Server**: The server must be the single source of truth. All game logic, state changes, and validation must happen on the server. Never trust the client.
- **Rooms**: Use Rooms (e.g., one room per game match) to broadcast messages efficiently to specific groups of players instead of to everyone.
- **Event Schema**: Define a clear, typed schema for all events sent between the client and server. Share these types between both projects to ensure consistency.
- **Pitfall**: Not planning for reconnection logic. Clients will disconnect; the server and client should handle this gracefully so players can rejoin a match in progress if possible.

## General

### 7. Language: TypeScript

- **Role**: The primary language for both our frontend (React/Phaser) and backend (Express) code.
- **Why**: TypeScript adds type safety, which helps prevent bugs, improves code quality, and makes the codebase easier to scale and maintain—a key requirement for an AI-first project.

#### Usage & Best Practices

- **Strict Mode**: Enable `strict: true` in `tsconfig.json` to catch the widest range of potential errors at compile time.
- **Shared Types**: For a full-stack project, create a shared directory (e.g., `common/types`) for type definitions used by both the client and server, especially for Socket.io event payloads.
- **Limitation**: TypeScript provides compile-time safety, not runtime safety. Data from external sources (like user input or API calls) must still be validated at runtime using a library like `zod`.

### 8. Core Game Asset: Tournament Word List

- **Role**: To serve as the official dictionary for validating player word submissions on the server.
- **Why**: A standard tournament word list ensures fair and competitive gameplay, as specified in the project overview. This will be a critical data asset loaded by our server.

#### Usage & Best Practices

- **Data Structure**: On server startup, load the entire word list into a `Set` for O(1) (instant) lookup performance.
- **Client-Side Security**: This file must **never** be included in the client-side bundle, as it would make cheating trivial. It is a server-only asset.
- **Pitfall**: Reading the file from disk for every word validation. This would be extremely slow and inefficient. Load it into memory once at startup.

### 9. Deployment Platform: Render

- **Role**: To host our entire application, including the static frontend files and the stateful Node.js backend server.
- **Why**: Render is a modern Platform-as-a-Service (PaaS) that drastically simplifies deployment. It allows us to deploy directly from a GitHub repository, handling the build process and infrastructure for us so we can focus on development.

#### Usage & Best Practices

- **Infrastructure as Code**: Use a `render.yaml` file in the root of the repository to define your services, build commands, and environment variables. This keeps your deployment configuration in version control.
- **Health Checks**: Implement a `/health` endpoint in your Express server that Render can ping to verify your service is running correctly.
- **Environment Variables**: Use Render's environment variable management for all secrets and configuration. Do not hardcode them.
- **Limitation**: Render's free tier services will "spin down" after a period of inactivity, causing a delay of up to 30 seconds on the next visit. This is acceptable for development but would require a paid plan for a production launch.

### 10. Core Game Logic: Board Generation Algorithm

- **Role**: To algorithmically guarantee that every game board generated at the start of a round is of high quality and solvable.
- **Why**: This prevents unfair or "dead" boards that have very few possible words, ensuring a fun and competitive experience from the first second.

#### Usage & Best Practices

- **Server-Side Logic**: This entire process is a server-side responsibility. The client only receives the final, validated board state.
- **Algorithm**:
  1.  The server starts with a full "bag" of tiles, weighted according to the official Scrabble letter distribution.
  2.  It will randomly draw tiles from this bag to fill the 4x4 (or 5x5, etc.) grid.
  3.  Once the grid is filled, the server will use its `DictionaryService` to programmatically scan the board for all possible words.
  4.  The board is considered "valid" only if it contains a minimum threshold of possible words (e.g., at least 8 words of 3+ letters).
  5.  If the board fails this check, it is discarded, and the server repeats the drawing process until a valid board is generated.
- **Pitfall**: Performing this check on the client side would expose the dictionary and make cheating possible. It must remain on the server.

## Appendix: Official Scrabble Distribution

This is the standard English letter distribution and point values used for this project.

- **0 Points**: Blank/Wild (2 tiles)
- **1 Point**: E (12), A (9), I (9), O (8), N (6), R (6), T (6), L (4), S (4), U (4)
- **2 Points**: D (4), G (3)
- **3 Points**: B (2), C (2), M (2), P (2)
- **4 Points**: F (2), H (2), V (2), W (2), Y (2)
- **5 Points**: K (1)
- **8 Points**: J (1), X (1)
- **10 Points**: Q (1), Z (1)
