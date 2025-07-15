# Phase 1: Barebones Foundation

**Goal**: To establish the project's technical foundation. This phase focuses on creating a runnable, developer-ready monorepo with a client and server that can communicate, but with no game logic implemented.

**Scope**: Project structure setup, server and client initialization, and basic client-server communication.

**Deliverable**: A developer can clone the repository, install dependencies, and run both the client and server. The client application will show a blank Phaser canvas and successfully establish a WebSocket connection to the server.

---

### Features & Tasks

#### 1. Monorepo & Project Initialization
*   **Description**: Set up the core monorepo structure using npm/yarn/pnpm workspaces to manage the client, server, and common packages independently.
*   **Steps**:
    1.  Initialize the root `package.json` to define the workspaces.
    2.  Create the `packages/client`, `packages/server`, and `packages/common` directories.
    3.  Create basic `package.json` files within each of the three packages.
    4.  Configure a root `tsconfig.json` to be extended by the individual packages.
    5.  Move all existing project documentation (`.md` files) into a new `docs/` directory.

#### 2. Basic Server Setup
*   **Description**: Create a minimal Express server that can run and accept Socket.io connections.
*   **Steps**:
    1.  In the `server` package, install `express`, `socket.io`, `typescript`, `ts-node`, and `nodemon`.
    2.  Create an `index.ts` file that initializes a basic Express server.
    3.  Integrate Socket.io, attach it to the server, and add a listener to log a message upon a new client connection.
    4.  Add a `dev` script to the server's `package.json` to run the server using `nodemon`.

#### 3. Basic Client Setup
*   **Description**: Scaffold the frontend application using Vite and integrate a blank Phaser game.
*   **Steps**:
    1.  In the `client` package, use Vite to scaffold a new `React + TypeScript` project.
    2.  Install `phaser` and `socket.io-client`.
    3.  Create a minimal Phaser game instance with a single, empty `GameScene`.
    4.  Create a React component to house and render the Phaser game canvas.

#### 4. Client-Server Communication
*   **Description**: Ensure the client can successfully connect to the server's WebSocket.
*   **Steps**:
    1.  Implement a client-side service to initialize the Socket.io connection.
    2.  Verify the connection by logging success messages on both the client and the server.
    3.  Configure Vite's development server (`vite.config.ts`) to proxy API requests to the Express backend to prevent CORS issues.

#### 5. Linting and Formatting
*   **Description**: Establish a consistent code style across the entire monorepo.
*   **Steps**:
    1.  Install and configure `ESLint` and `Prettier` in the root of the project.
    2.  Create shared configurations that can be extended by the `client` and `server` packages.
    3.  Add `lint` and `format` scripts to the root `package.json`. 